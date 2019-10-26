const { Expo } = require('expo-server-sdk')

const NotificationTokenCollection = require('../models/NotificationTokenCollection')

let expo = new Expo();

class NotificationService {
  constructor (db) {
    this.notificationTokenCollection = new NotificationTokenCollection(db)
  }

  sendEveryonePushNotification = (message) => {
    return new Promise((resolve, reject) => {
      this.notificationTokenCollection
        .getAllNotificationsTokens()
        .then(tokens => {
          this
            .sendPushNotification(tokens, message)
            .then(() => resolve())
            .catch((error) => reject(error))
        })
        .catch(error => {
          reject({
            error
          })
        })
    })
  }

  sendPushNotification = (pushTokens, message) => {
    return new Promise(async (resolve, reject) => {
      const pushMessages = pushTokens
        .filter(token => Expo.isExpoPushToken(token))
        .map(token => ({
          ...message,
          to: token
        }))
  
      const chunks = expo.chunkPushNotifications(pushMessages);
  
      for (const chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
        } catch (error) {
          console.error(error)
        }
      }
      console.log(`Send ${message.title} notification to (${pushTokens.length}) tokens`)
      resolve()
    })
  }
}

module.exports = NotificationService


