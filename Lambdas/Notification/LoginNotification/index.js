const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: "us-east-1" }); // Update with your SNS region

exports.handler = async (event) => {
  try {
    // const email = event.email; // Assuming the event contains the email address directly
    // const userId = event.userId; // Assuming the event contains the userId directly

    const email = event.request.userAttributes.email
    const userId = event.request.userAttributes.sub

    if (!email || !userId) {
      throw new Error("Email and UserId are required");
    }

    const topicName = `AuthTopic-${userId}`;

    // Function to get the ARN of a topic by name
    const getTopicArnByName = async (topicName) => {
      let nextToken = null;
      do {
        const listTopicsParams = {
          NextToken: nextToken,
        };
        const topicsResponse = await sns.listTopics(listTopicsParams).promise();
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
    };

    // Function to check if an email is already subscribed to a topic
    const isEmailSubscribed = async (topicArn, email) => {
      let nextToken = null;
      do {
        const listSubscriptionsParams = {
          TopicArn: topicArn,
          NextToken: nextToken,
        };
        const subscriptionsResponse = await sns
          .listSubscriptionsByTopic(listSubscriptionsParams)
          .promise();
        for (const subscription of subscriptionsResponse.Subscriptions) {
          if (subscription.Endpoint === email) {
            return true;
          }
        }
        nextToken = subscriptionsResponse.NextToken;
      } while (nextToken);
      return false;
    };

    // Check if the topic already exists
    let topicArn = await getTopicArnByName(topicName);

    // If the topic does not exist, create a new one
    if (!topicArn) {
      const createTopicParams = {
        Name: topicName,
      };
      const createTopicResponse = await sns
        .createTopic(createTopicParams)
        .promise();
      topicArn = createTopicResponse.TopicArn;
      console.log(`Created SNS topic ${topicArn}`);
    } else {
      console.log(`SNS topic ${topicArn} already exists`);
    }

    // Check if the email is already subscribed to the topic
    const subscribed = await isEmailSubscribed(topicArn, email);

    // Subscribe the email if not already subscribed
    if (!subscribed) {
      const subscribeParams = {
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: email,
      };
      const subscribeResponse = await sns.subscribe(subscribeParams).promise();
      console.log(
        `Subscribed email ${email} to topic ${topicArn}:`,
        subscribeResponse
      );

      // Wait for subscription to be confirmed
      await new Promise((resolve) => setTimeout(resolve, 60000));
    } else {
      console.log(`Email ${email} is already subscribed to topic ${topicArn}`);
    }

    // Publish a notification to the SNS topic
    const publishParams = {
      Message: `User ${email} has successfully logged in.`,
      Subject: "Login Successful",
      TopicArn: topicArn,
    };
    const publishResponse = await sns.publish(publishParams).promise();
    console.log(`Published message to topic ${topicArn}:`, publishResponse);

    return event
  } catch (err) {
    console.error("Error processing notification:", err);
    return event
  }
};
