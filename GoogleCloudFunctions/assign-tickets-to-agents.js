const fetch = require('node-fetch');
const {PubSub} = require('@google-cloud/pubsub');
const { Firestore } = require('@google-cloud/firestore');
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const firestore = new Firestore();
const pubSubClient = new PubSub();
const COLLECTION_NAME = 'tickets';
const TOPIC_NAME = 'ticket-messages';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.assignTicketsToAgents = async (event, context) => {
  const resp = await fetch('https://hmemmeyh1b.execute-api.us-east-1.amazonaws.com/dev/agents');
  const agents = await  resp.json();
  const randomAgentIndex = getRandomNumber(0, agents.length - 1);
  const randomAgentUsername = agents[randomAgentIndex].username;
  const eventData = event.data
    ? JSON.parse(Buffer.from(event.data, 'base64').toString())
    : 'Hello, World';
  const ticketId = eventData.ticketId;
  const document = firestore.doc(`${COLLECTION_NAME}/${ticketId}`);
  await document.set({
    assigneeId: randomAgentUsername, 
  }, {merge: true});
  const message = {
    ticketId,
    sender: eventData.userId,
    senderType: "client",
    message: eventData.query
  }
  const topic = pubSubClient.topic(TOPIC_NAME);
  await topic.publishMessage({data: Buffer.from(JSON.stringify(message))});
  console.log({ticketId,randomAgentUsername});
};
