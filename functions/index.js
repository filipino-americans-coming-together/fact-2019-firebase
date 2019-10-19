const admin = require('firebase-admin');
const bodyParser = require('body-parser')
const express = require('express');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('The FACT API Lives!')
})

//  Routes
const NotificationTokenRouter = require('./controllers/NotificationTokenRouter')
app.use('/notification-tokens', new NotificationTokenRouter(db).routes)

exports.app = functions.https.onRequest(app);