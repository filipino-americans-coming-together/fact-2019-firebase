const express = require('express')

const NotificationTokenCollection = require('../models/NotificationTokenCollection')

class NotificationTokenRouter {
  constructor (db) {
    this.router = express.Router()
    this.notificationTokenCollection = new NotificationTokenCollection(db) 

    this.router.get('/', (req, res) => {
      this.notificationTokenCollection
        .getAllNotificationsTokens()
        .then(_res => {
          res
            .status(200)
            .send({
              message: 'Successfully got all notification tokens!',
              data: {
                tokens: _res
              }
            })

        })
        .catch(error => {
          res
            .status(500)
            .send({
              message: 'Unable to get all notification tokens.',
              error
            })
        })
    })
    
    this.router.put('/', (req, res) => {
      const token = req.body.token
      if (token) {
        this.notificationTokenCollection
          .saveNotificationToken(token)
          .then(_res => {
            res
              .status(201)
              .send({
                message: 'Notification token saved!',
                data: {
                  id: _res
                }
              })
          })
          .catch(error => {
            res
              .status(500)
              .send({
                message: 'Unable to save notification.',
                error
              })
          })
      } else {
        res
          .status(400)
          .send({
            message: "Provide token to save in request body."
          })
      }
      
    })
  }

  get routes() {
    return this.router
  }
}

module.exports = NotificationTokenRouter