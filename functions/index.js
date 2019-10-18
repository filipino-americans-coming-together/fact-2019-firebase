const bodyParser = require('body-parser')
const express = require('express');
const functions = require('firebase-functions');

const app = express();
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('The FACT API Lives!')
})

//  Routes
const users = require('./controllers/users')
app.use('/users', users)



exports.app = functions.https.onRequest(app);