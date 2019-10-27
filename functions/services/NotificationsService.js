const { Expo } = require('expo-server-sdk')

const NotificationTokenCollection = require('../models/NotificationTokenCollection')

let expo = new Expo();

class NotificationService {
  constructor (db) {
    this.notificationTokenCollection = new NotificationTokenCollection(db)
  }

  sendEveryonePushNotification (message) {
    return new Promise((resolve, reject) => {
      this.notificationTokenCollection
        .getAllNotificationsTokens()
        .then(function(tokens) {
          this
            .sendPushNotification(tokens, message)
            .then(() => resolve())
            .catch((error) => reject(error))
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  }

  sendPushNotification (pushTokens, message) {
    return new Promise(async (resolve, reject) => {
      const pushMessages = pushTokens
        .filter(token => Expo.isExpoPushToken(token))
        .map(function(token) {
          return ({
            title: message.title,
            body: message.title,
            to: token
          })
        })
  
      const chunks = expo.chunkPushNotifications(pushMessages);
  
      const results = []
      for (const chunk of chunks) {
        results.push(expo.sendPushNotificationsAsync(chunk))
      }
      await Promise.all(results)
      console.log('Result:', results)
      console.log(`Send ${message.title} notification to (${pushTokens.length}) tokens`)
      resolve()
    })
  }
}

module.exports = NotificationService


