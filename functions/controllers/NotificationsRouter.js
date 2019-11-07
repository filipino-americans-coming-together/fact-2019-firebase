const express = require('express')

const NotificationTokenCollection = require('../models/NotificationTokenCollection')
const NoticationsService = require('../services/NotificationsService')

class NotificationsRouter {
  constructor (db) {
    this.router = express.Router()
    this.notificationTokenCollection = new NotificationTokenCollection(db) 
    this.noticationsService = new NoticationsService(db)

    this.router.get('/', (req, res) => {
      res
        .status(200)
        .send({
          message: '/notifications endpoint is live'
        })
    })

    this.router.post('/', (req, res) => {
      const { notification } = req.body
      if (!notification) {
        res
          .status(400)
          .send({
            message: 'Provide notification to send in request body.'
          })
      }
      const { title, body } = notification
      if (!title || !body) {
        res
          .status(400)
          .send({
            message: '`title` and `body` are required fields for a notification.'
          })
      }
      const message = { title, body }

      this.noticationsService.sendEveryonePushNotification(message)
        .then(() => {
          res
            .status(200)
            .send({
              message: 'Sent push notifications.'
            })
        })
        .catch((err) => {
          res
            .status(500)
            .send({
              message: 'Error sending push notifications.',
              error: err
            })
        })
    })

    this.router.get('/tokens', (req, res) => {
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
    
    this.router.post('/tokens', (req, res) => {
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

module.exports = NotificationsRouter
