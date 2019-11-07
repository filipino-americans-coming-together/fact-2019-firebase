const { Expo } = require('expo-server-sdk')

const NotificationTokenCollection = require('../models/NotificationTokenCollection')

let expo = new Expo();

class NotificationService {
  constructor (db) {
    this.notificationTokenCollection = new NotificationTokenCollection(db)
  }

  sendEveryonePushNotification (message) {
    const sendPushNotification = (pushTokens, message) => {
      return new Promise(async (resolve, reject) => {
        const pushMessages = pushTokens
          .filter(token => Expo.isExpoPushToken(token))
          .map(function(token) {
            return ({
              title: message.title,
              body: message.body,
              to: token
            })
          })
    
        const chunks = expo.chunkPushNotifications(pushMessages);
    
        const results = []
        for (const chunk of chunks) {
          results.push(expo.sendPushNotificationsAsync(chunk))
        }
        Promise.all(results)
          .then((res) => {
            console.log('Result:', results)
            console.log(`Send ${message.title} notification to (${pushTokens.length}) tokens`)
            resolve()
          })
          .catch(err => reject(new Error(err)))
        
      })
    }
    return new Promise((resolve, reject) => {
      this.notificationTokenCollection
        .getAllNotificationsTokens()
        .then(function(tokens) {
          const uniqueTokens = []
          const uniqueTokenLookupSet = new Set()
          tokens.forEach(token => {
            if (!uniqueTokenLookupSet.has(token)) {
              uniqueTokenLookupSet.add(token)
              uniqueTokens.push(token)
            } 
          })
          sendPushNotification(uniqueTokens, message)
            .then(() => resolve())
            .catch((error) => reject(new Error(error)))
        })
        .catch(error => {
          reject(new Error(error))
        })
    })
  }
}

module.exports = NotificationService


