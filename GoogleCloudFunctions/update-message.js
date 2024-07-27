const { Firestore } = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const firestore = new Firestore();
const COLLECTION_NAME = 'tickets';
exports.updateMessages = async (event, context) => {
  const eventData = event.data
    ? JSON.parse(Buffer.from(event.data, 'base64').toString())
    : 'Hello, World';
  console.log({eventData})
  const ticketId = eventData.ticketId;
  const document = firestore.doc(`${COLLECTION_NAME}/${ticketId}`);
  const doc = (await document.get()).data();
  console.log({doc})
  const {
    sender,
    senderType,
    message,
  } = eventData;
  const messageId = uuidv4();
  const messageData = {
    messageId,
    sender,
    senderType,
    message,
  }
  doc.messages.push(messageData);
  await document.set(doc, {merge: true}) 
  console.log(message);
};
