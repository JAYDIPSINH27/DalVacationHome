const AWS = require('aws-sdk');
const { BigQuery } = require('@google-cloud/bigquery');

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const ssm = new AWS.SSM();

const USER_POOL_ID = "us-east-1_qHroeVVYU";
const BOOKINGS_TABLE_NAME = "BookingsTable";
const USER_LOGIN_TABLE_NAME = "UserLogin";
const GCP_CREDENTIALS_PARAM_NAME = "gcp-credentials";
const BIGQUERY_DATASET = "UserLogin";
const BIGQUERY_TABLE = "statistic";

exports.handler = async (event) => {
    try {
        console.log('Starting function execution');

        const { totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange } = await fetchData();
        const gcpCredentials = await fetchGCPCredentials(GCP_CREDENTIALS_PARAM_NAME);

        await insertDataIntoBigQuery({
            totalUsers,
            activeUsers,
            totalBookedRooms,
            bookingsCountInTimeRange,
            gcpCredentials
        });

        console.log('Returning successful response');
        return {
            statusCode: 200,
            body: JSON.stringify({
                total_users: totalUsers,
                active_users: activeUsers,
                total_booked_rooms: totalBookedRooms,
                bookings_count_in_time_range: bookingsCountInTimeRange
            }),
        };
    } catch (error) {
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

async function fetchData() {
    console.log('Fetching total users from Cognito');
    const listUsersResponse = await cognito.listUsers({ UserPoolId: USER_POOL_ID }).promise();
    const totalUsers = listUsersResponse.Users.length;
    console.log(`Total users: ${totalUsers}`);

    console.log('Fetching user login data from DynamoDB');
    const scanParams = { TableName: USER_LOGIN_TABLE_NAME };
    const loginData = await dynamodb.scan(scanParams).promise();

    const startTime = new Date();
    startTime.setMonth(startTime.getMonth() - 1);
    const endTime = new Date(new Date().setHours(23, 59, 59, 999));

    const activeUsers = loginData.Items.filter(item => {
        const lastLogin = new Date(item.last_login);
        return lastLogin >= startTime && lastLogin <= endTime;
    }).length;

    console.log(`Active users in time range: ${activeUsers}`);

    console.log('Fetching total booked rooms from DynamoDB');
    const bookingsScanParams = { TableName: BOOKINGS_TABLE_NAME, Select: 'COUNT' };
    const bookingsData = await dynamodb.scan(bookingsScanParams).promise();
    const totalBookedRooms = bookingsData.Count;
    console.log(`Total booked rooms: ${totalBookedRooms}`);

    console.log('Fetching bookings count within the time range from DynamoDB');
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

    return { totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange };
}

async function fetchGCPCredentials(paramName) {
    console.log('Fetching GCP credentials from Parameter Store');
    const gcpCredentialsParam = await ssm.getParameter({ Name: paramName, WithDecryption: true }).promise();
    return JSON.parse(gcpCredentialsParam.Parameter.Value);
}

async function insertDataIntoBigQuery({ totalUsers, activeUsers, totalBookedRooms, bookingsCountInTimeRange, gcpCredentials }) {
    const bigquery = new BigQuery({
        credentials: gcpCredentials,
        projectId: gcpCredentials.project_id
    });

    await ensureBigQueryDatasetExists(bigquery, BIGQUERY_DATASET);
    await ensureBigQueryTableExists(bigquery, BIGQUERY_DATASET, BIGQUERY_TABLE);

    console.log('Inserting data into BigQuery');
    const rows = [{
        total_users: totalUsers,
        active_users: activeUsers,
        total_booked_rooms: totalBookedRooms,
        bookings_count_in_time_range: bookingsCountInTimeRange,
        timestamp: new Date().toISOString()
    }];

    await bigquery.dataset(BIGQUERY_DATASET).table(BIGQUERY_TABLE).insert(rows);
    console.log('Data successfully inserted into BigQuery');
}

async function ensureBigQueryDatasetExists(bigquery, datasetName) {
    console.log(`Checking if dataset ${datasetName} exists`);
    const [datasets] = await bigquery.getDatasets();
    const datasetExists = datasets.some(dataset => dataset.id === datasetName);

    if (!datasetExists) {
        console.log(`Dataset ${datasetName} does not exist, creating it`);
        await bigquery.createDataset(datasetName);
        console.log(`Dataset ${datasetName} created`);
    } else {
        console.log(`Dataset ${datasetName} already exists`);
    }
}

async function ensureBigQueryTableExists(bigquery, datasetName, tableName) {
    console.log(`Checking if table ${tableName} exists`);
    const [tables] = await bigquery.dataset(datasetName).getTables();
    const tableExists = tables.some(table => table.id === tableName);

    if (!tableExists) {
        console.log(`Table ${tableName} does not exist, creating it`);
        await bigquery.dataset(datasetName).createTable(tableName, {
            schema: [
                { name: 'total_users', type: 'INTEGER' },
                { name: 'active_users', type: 'INTEGER' },
                { name: 'total_booked_rooms', type: 'INTEGER' },
                { name: 'bookings_count_in_time_range', type: 'INTEGER' },
                { name: 'timestamp', type: 'TIMESTAMP' }
            ]
        });
        console.log(`Table ${tableName} created`);
    } else {
        console.log(`Table ${tableName} already exists`);
    }
}
