const CollectionNames = require('../constants/CollectionNames') 
 
class NotificationTokensCollection {
  constructor (db) {
    this.NotificationTokenCollection = db.collection(
      CollectionNames.NOTIFICATION_TOKENS
    )
  }

  getAllNotificationsTokens() {
    return new Promise((resolve, reject) => {
      this.NotificationTokenCollection
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            resolve([])
          }
          let tokens = []
          snapshot.forEach(doc => {
            tokens.push(doc.data().token)
          })
          resolve(tokens)

        })
        .catch(error => reject(new Error(error)))
    })
  }

  saveNotificationToken(token) {
    return new Promise((resolve, reject) => {
      this.NotificationTokenCollection
        .add({ token })
        .then(ref => resolve(ref.id))
        .catch(error => reject(new Error(error)))
    })
  }
}

module.exports = NotificationTokensCollection