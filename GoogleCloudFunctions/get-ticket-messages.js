const { Firestore } = require('@google-cloud/firestore');
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const firestore = new Firestore();
const COLLECTION_NAME = 'tickets';
exports.getMessages = async (req, res) => {
  const body = req.body;
  const ticketId = body.ticketId;
  const document = firestore.doc(`${COLLECTION_NAME}/${ticketId}`);
  const doc = (await document.get()).data();
  res.status(200).send(doc);
};
