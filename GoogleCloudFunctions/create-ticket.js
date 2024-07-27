const { Firestore } = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
const {PubSub} = require('@google-cloud/pubsub');

// Firestore collection name
const firestore = new Firestore();
const pubSubClient = new PubSub();
const COLLECTION_NAME = 'tickets';
const TOPIC_NAME = 'unassigned-messages';

exports.createTicket = async (req, res) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        
        // Respond to OPTIONS method
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }
        const body = req.body;
        const userId = body.user_id;
        const query = body.query;
        const bookingId = body.bookingId;

        // Generate a UUID for the deck
        const ticketId = uuidv4();
        const document = firestore.doc(`${COLLECTION_NAME}/${ticketId}`);

        const ticket = {
          ticketId,
          bookingId,
          userId,
          query,
          assigneeId: null,
          messages: []
        }
        // Add the item to Firestore
        await document.set(ticket);
        const topic = pubSubClient.topic(TOPIC_NAME);
        await topic.publishMessage({data: Buffer.from(JSON.stringify(ticket))});
        res.status(201).json({ message: 'Ticket created successfully', data: ticket });
    } catch (e) {
        console.log(JSON.stringify({e}))
        res.status(500).json({ message: e.message });
    }
};
