const AWS = require('aws-sdk');  // Import AWS SDK for JavaScript
const { BigQuery } = require('@google-cloud/bigquery');  // Import BigQuery from Google Cloud

const cognito = new AWS.CognitoIdentityServiceProvider();  // Create Cognito service provider instance
const dynamodb = new AWS.DynamoDB.DocumentClient();  // Create DynamoDB DocumentClient instance
const ssm = new AWS.SSM();  // Create SSM service instance

// Define constants for various AWS services and BigQuery
const USER_POOL_ID = "us-east-1_1gMhUA7Dk";
const BOOKINGS_TABLE_NAME = "BookingsTable";
const USER_LOGIN_TABLE_NAME = "login_data";
const GCP_CREDENTIALS_PARAM_NAME = "gcpcredentials";
const BIGQUERY_DATASET = "UserLogin";
const BIGQUERY_TABLE = "statistic";

// Lambda function handler
exports.handler = async (event) => {
    try {
        console.log('Starting function execution');

        // Fetch data from Cognito and DynamoDB
        const { totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange, loggedInUsersInTimeRange } = await fetchData();

        // Fetch GCP credentials from AWS SSM Parameter Store
        const gcpCredentials = await fetchGCPCredentials(GCP_CREDENTIALS_PARAM_NAME);

        // Insert fetched data into BigQuery
        await insertDataIntoBigQuery({
            totalUsers,
            activeUsers,
            totalBookedRooms,
            bookingsCountInTimeRange,
            loggedInUsersInTimeRange,
            gcpCredentials
        });

        console.log('Returning successful response');

        // Return the result as an HTTP response
        return {
            statusCode: 200,
            body: JSON.stringify({
                total_users: totalUsers,
                active_users: activeUsers,
                total_booked_rooms: totalBookedRooms,
                bookings_count_in_time_range: bookingsCountInTimeRange,
                logged_in_users_in_time_range: loggedInUsersInTimeRange
            }),
        };
    } catch (error) {
        // Handle errors and return a failure response
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error occurred',
                message: error.message
            }),
        };
    }
};

// Function to fetch data from Cognito and DynamoDB
async function fetchData() {
    console.log('Fetching total users from Cognito');

    // Fetch the total number of users from the Cognito User Pool
    const listUsersResponse = await cognito.listUsers({ UserPoolId: USER_POOL_ID }).promise();
    const totalUsers = listUsersResponse.Users.length;
    console.log(`Total users: ${totalUsers}`);

    console.log('Fetching user login data from DynamoDB');

    // Fetch user login data from DynamoDB
    const scanParams = { TableName: USER_LOGIN_TABLE_NAME };
    const loginData = await dynamodb.scan(scanParams).promise();

    // Define a time range for calculating active users
    const startTime = new Date();
    startTime.setMonth(startTime.getMonth() - 1);
    const endTime = new Date(new Date().setHours(23, 59, 59, 999));

    // Count active users based on login data
    const activeUsers = loginData.Items.filter(item => {
        const lastLogin = new Date(item.last_login);
        return lastLogin >= startTime && lastLogin <= endTime;
    }).length;
    console.log(`Active users in time range: ${activeUsers}`);

    console.log('Fetching logged-in users in time range');

    // Count logged-in users within the defined time range
    const loggedInUsersInTimeRange = loginData.Items.filter(item => {
        const loginDate = new Date(item.last_login);
        return loginDate >= startTime && loginDate <= endTime;
    }).length;
    console.log(`Logged-in users in time range: ${loggedInUsersInTimeRange}`);

    console.log('Fetching total booked rooms from DynamoDB');

    // Fetch the total number of booked rooms from DynamoDB
    const bookingsScanParams = { TableName: BOOKINGS_TABLE_NAME, Select: 'COUNT' };
    const bookingsData = await dynamodb.scan(bookingsScanParams).promise();
    const totalBookedRooms = bookingsData.Count;
    console.log(`Total booked rooms: ${totalBookedRooms}`);

    console.log('Fetching bookings count within the time range from DynamoDB');

    // Count the number of bookings within the defined time range
    const scanParamsWithTimestamp = {
        TableName: BOOKINGS_TABLE_NAME,
        FilterExpression: "#createdAt BETWEEN :start AND :end",
        ExpressionAttributeNames: { "#createdAt": "createdAt" },
        ExpressionAttributeValues: {
            ":start": startTime.toISOString(),
            ":end": endTime.toISOString()
        },
        Select: 'COUNT'
    };
    const timeRangeData = await dynamodb.scan(scanParamsWithTimestamp).promise();
    const bookingsCountInTimeRange = timeRangeData.Count;
    console.log(`Bookings count in time range: ${bookingsCountInTimeRange}`);

    // Return all fetched data
    return { totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange, loggedInUsersInTimeRange };
}

// Function to fetch GCP credentials from AWS SSM Parameter Store
async function fetchGCPCredentials(paramName) {
    console.log('Fetching GCP credentials from Parameter Store');
    const gcpCredentialsParam = await ssm.getParameter({ Name: paramName, WithDecryption: true }).promise();
    return JSON.parse(gcpCredentialsParam.Parameter.Value);
}

// Function to insert data into Google BigQuery
async function insertDataIntoBigQuery({ totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange, loggedInUsersInTimeRange, gcpCredentials }) {
    // Create a BigQuery client with the fetched credentials
    const bigquery = new BigQuery({
        credentials: gcpCredentials,
        projectId: gcpCredentials.project_id
    });

    // Ensure that the BigQuery dataset exists
    await ensureBigQueryDatasetExists(bigquery, BIGQUERY_DATASET);

    // Ensure that the BigQuery table exists
    await ensureBigQueryTableExists(bigquery, BIGQUERY_DATASET, BIGQUERY_TABLE);

    console.log('Inserting data into BigQuery');

    // Prepare the data rows to be inserted into BigQuery
    const rows = [{
        total_users: totalUsers,
        active_users: activeUsers,
        total_booked_rooms: totalBookedRooms,
        bookings_count_in_time_range: bookingsCountInTimeRange,
        logged_in_users_in_time_range: loggedInUsersInTimeRange,
        timestamp: new Date().toISOString()
    }];

    // Insert the data rows into the specified BigQuery table
    await bigquery.dataset(BIGQUERY_DATASET).table(BIGQUERY_TABLE).insert(rows);
    console.log('Data successfully inserted into BigQuery');
}

// Function to check if a BigQuery dataset exists, and create it if it does not
async function ensureBigQueryDatasetExists(bigquery, datasetName) {
    console.log(`Checking if dataset ${datasetName} exists`);

    // Get the list of datasets in BigQuery
    const [datasets] = await bigquery.getDatasets();
    const datasetExists = datasets.some(dataset => dataset.id === datasetName);

    // If the dataset does not exist, create it
    if (!datasetExists) {
        console.log(`Dataset ${datasetName} does not exist, creating it`);
        await bigquery.createDataset(datasetName);
        console.log(`Dataset ${datasetName} created`);
    } else {
        console.log(`Dataset ${datasetName} already exists`);
    }
}

// Function to check if a BigQuery table exists, and create it if it does not
async function ensureBigQueryTableExists(bigquery, datasetName, tableName) {
    console.log(`Checking if table ${tableName} exists`);

    // Get the list of tables in the specified dataset
    const [tables] = await bigquery.dataset(datasetName).getTables();
    const tableExists = tables.some(table => table.id === tableName);

    // If the table does not exist, create it with the specified schema
    if (!tableExists) {
        console.log(`Table ${tableName} does not exist, creating it`);
        await bigquery.dataset(datasetName).createTable(tableName, {
            schema: [
                { name: 'total_users', type: 'INTEGER' },
                { name: 'active_users', type: 'INTEGER' },
                { name: 'total_booked_rooms', type: 'INTEGER' },
                { name: 'bookings_count_in_time_range', type: 'INTEGER' },
                { name: 'logged_in_users_in_time_range', type: 'INTEGER' },
                { name: 'timestamp', type: 'TIMESTAMP' }
            ]
        });
        console.log(`Table ${tableName} created`);
    } else {
        console.log(`Table ${tableName} already exists`);
    }
}
