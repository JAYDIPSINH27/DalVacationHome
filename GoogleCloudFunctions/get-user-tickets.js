const { Firestore } = require('@google-cloud/firestore');
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const COLLECTION_NAME = 'tickets';
const firestore = new Firestore();
exports.getUserMessages = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
        
  // Respond to OPTIONS method
  if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
  }
  const body = req.body;
  const userType = body.role;
  const userId = body.userId;
  const snapshot = await firestore.collection(COLLECTION_NAME).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      res.status(200).json([]);
      return;
    }

    let documents = [];
    snapshot.forEach(doc => {
      if((userType == "client" && doc.data().userId == userId) || (userType == "agent" && doc.data().assigneeId == userId)){
        documents.push({ id: doc.id, data: doc.data() });
      }
    });

    res.status(200).json(documents);
};
