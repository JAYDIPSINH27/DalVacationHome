const {PubSub} = require('@google-cloud/pubsub');
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const pubSubClient = new PubSub();
const TOPIC_NAME = 'ticket-messages';
exports.sendMessage = async (req, res) => {
  const body = req.body;
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Respond to OPTIONS method
  if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
  }
  try {
    const {
        senderType,
        sender,
        message,
        ticketId,
    } = body;
    const messageData = {
        senderType,
        sender,
        message,
        ticketId,
    }
    const topic = pubSubClient.topic(TOPIC_NAME);
    console.log({messageData});
    await topic.publishMessage({data: Buffer.from(JSON.stringify(messageData))});
    const response = {
      message: "Message sent"
    }
    res.status(200).send(response);
  }catch(err){
    console.error('Error publishing message:', err);
    res.status(500).send({ error: 'Failed to send message ' + JSON.stringify(err) });
  }
};
