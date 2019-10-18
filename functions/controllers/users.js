const express = require('express')
const users = express.Router()

users.get('/', (req, res) => {
  res.send('/user endpoint is live')
})

users.put('/notificationToken', (req, res) => {
  
})

module.exports = users