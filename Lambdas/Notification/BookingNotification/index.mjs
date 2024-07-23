import { SNSClient, ListTopicsCommand, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = "us-east-1";
const sns = new SNSClient({ region: REGION });
const dynamoDbClient = new DynamoDBClient({ region: REGION });
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (event) => {
    try {
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            await processBooking(messageBody.bookingId);
        }

        return {
            statusCode: 200,
            body: JSON.stringify("Bookings confirmed and notifications sent successfully"),
        };
    } catch (err) {
        console.error("Error confirming booking ", err);
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify("Error confirming booking: " + err.message),
        };
    }
};

async function processBooking(bookingId) {
    try {
        console.log(`Starting to process booking: ${bookingId}`);
        const bookingData = await getBookingData(bookingId);

        await updateRoomAvailability({
            roomId: bookingData.roomId,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate
        });
        await updateBookingStatus(bookingId);
        await sendConfirmationEmail(bookingData);
        console.log(`Successfully processed booking: ${bookingId}`);
    } catch (error) {
        console.error(`Error processing booking ${bookingId}:`, error);
        throw error;
    }
}

async function getBookingData(bookingId) {
    try {
        console.log(`Attempting to get booking data for bookingId: ${bookingId}`);
        const bookingParams = {
            TableName: "BookingsTable",
            Key: { bookingId: bookingId },
        };

        const { Item } = await dynamoDb.send(new GetCommand(bookingParams));

        if (!Item) {
            const error = new Error(`Booking not found for bookingId: ${bookingId}`);
            error.statusCode = 404;
            throw error;
        }

        console.log(`Successfully retrieved booking data for bookingId: ${bookingId}`);
        return Item;
    } catch (error) {
        console.error(`Error in getBookingData for bookingId ${bookingId}:`, error);
        // console.error('Params used:', JSON.stringify(bookingParams, null, 2));
        throw error;
    }
}

async function updateBookingStatus(bookingId) {
    try {
        console.log(`Attempting to update booking status for bookingId: ${bookingId}`);
        const updateBookingParams = {
            TableName: "BookingsTable",
            Key: { bookingId: bookingId },
            UpdateExpression: "set bookingStatus = :status",
            ExpressionAttributeValues: { ":status": "CONFIRMED" },
            ReturnValues: "UPDATED_NEW",
        };

        const result = await dynamoDb.send(new UpdateCommand(updateBookingParams));
        console.log(`Successfully updated booking status for bookingId: ${bookingId}`);
        return result;
    } catch (error) {
        console.error(`Error in updateBookingStatus for bookingId ${bookingId}:`, error);
        // console.error('Params used:', JSON.stringify(updateBookingParams, null, 2));
        throw error;
    }
}

async function updateRoomAvailability(bookingData) {
    try {
        console.log(`Updating room availability for roomId: ${bookingData.roomId}`);
        let roomIdNumber = Number(bookingData.roomId);

        // Get the current room data
        const { Item } = await dynamoDb.send(new GetCommand({
            TableName: "RoomsTable",
            Key: { "room_number": roomIdNumber }
        }));
        
        if (!Item || !Item.dates || !Array.isArray(Item.dates)) {
            throw new Error(`Room ${bookingData.roomId} not found or dates attribute is not in the expected format`);
        }

        // Process the dates
        const updatedDates = [];
        const bookingStart = new Date(bookingData.startDate);
        const bookingEnd = new Date(bookingData.endDate);
        
        for (const dateRange of Item.dates) {
            const start = new Date(dateRange.StartDate);
            const end = new Date(dateRange.EndDate);

            // Case 1: Booking is completely outside this range
            if (bookingEnd <= start || bookingStart >= end) {
                updatedDates.push(dateRange);
            }
            // Case 2: Booking starts after range start and ends before range end
            else if (bookingStart > start && bookingEnd < end) {
                if (start < bookingStart) {
                    updatedDates.push({
                        StartDate: start.toISOString().split('T')[0],
                        EndDate: new Date(bookingStart.getTime() - 86400000).toISOString().split('T')[0]
                    });
                }
                if (bookingEnd < end) {
                    updatedDates.push({
                        StartDate: new Date(bookingEnd.getTime() + 86400000).toISOString().split('T')[0],
                        EndDate: end.toISOString().split('T')[0]
                    });
                }
            }
            // Case 3: Booking starts before range start but ends within range
            else if (bookingStart <= start && bookingEnd < end && bookingEnd > start) {
                updatedDates.push({
                    StartDate: new Date(bookingEnd.getTime() + 86400000).toISOString().split('T')[0],
                    EndDate: end.toISOString().split('T')[0]
                });
            }
            // Case 4: Booking starts within range but ends after range end
            else if (bookingStart > start && bookingStart < end && bookingEnd >= end) {
                updatedDates.push({
                    StartDate: start.toISOString().split('T')[0],
                    EndDate: new Date(bookingStart.getTime() - 86400000).toISOString().split('T')[0]
                });
            }
            // Case 5: Booking completely encompasses this range
            // In this case, we don't add anything to updatedDates
        }

        // Update the room with the new dates
        const params = {
            TableName: "RoomsTable",
            Key: { "room_number": roomIdNumber },
            UpdateExpression: "SET #dates = :updatedDates",
            ExpressionAttributeNames: { "#dates": "dates" },
            ExpressionAttributeValues: { ":updatedDates": updatedDates },
            ReturnValues: "UPDATED_NEW"
        };

        const result = await dynamoDb.send(new UpdateCommand(params));
        console.log(`Successfully updated room availability for roomId: ${bookingData.roomId}`);
        return result;
    } catch (error) {
        console.error(`Error updating room availability for roomId ${bookingData.roomId}:`, error);
        throw error;
    }
}


async function sendConfirmationEmail(bookingData) {
    try {
        const { userId, userName, bookingId } = bookingData;
        const topicName = `AuthTopic-${userId}`;
        const topicArn = await getTopicArnByName(topicName);

        if (!topicArn) {
            console.warn(`SNS topic not found for userId: ${userId}`);
            return;
        }

        const emailParams = {
            TopicArn: topicArn,
            Message: `Hello ${userName}! Your booking (ID: ${bookingId}) has been successfully created.`,
            Subject: "Booking Confirmation",
        };

        await sns.send(new PublishCommand(emailParams));
        console.log(`Confirmation email sent for bookingId: ${bookingId}`);
    } catch (error) {
        console.error(`Error sending confirmation email:`, error);
        console.error('Booking data:', JSON.stringify(bookingData, null, 2));
        throw error;
    }
}

async function getTopicArnByName(topicName) {
    try {
        let nextToken = null;
        do {
            const listTopicsParams = { NextToken: nextToken };
            const topicsResponse = await sns.send(new ListTopicsCommand(listTopicsParams));
            for (const topic of topicsResponse.Topics) {
                const topicArn = topic.TopicArn;
                const arnParts = topicArn.split(":");
                const existingTopicName = arnParts[arnParts.length - 1];
                if (existingTopicName === topicName) {
                    return topicArn;
                }
            }
            nextToken = topicsResponse.NextToken;
        } while (nextToken);
        return null;
    } catch (error) {
        console.error(`Error getting topic ARN for topicName: ${topicName}`, error);
        throw error;
    }
}