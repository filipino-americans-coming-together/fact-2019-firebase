const CollectionNames = require('../constants/CollectionNames')

class updatesCollectionModel {
  constructor(db) {
    this.UpdatesCollection = db.collection(
      CollectionNames.UPDATES
    )
  }

  getAllUpdates() {
    return new Promise((resolve, reject) => {
      this.UpdatesCollection
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            resolve([])
          }

          let updates = []
          snapshot.forEach(doc => {
            updates.push(doc.data())
          })
          resolve(updates)
        })
        .catch(error => reject(new Error(error)))
    })
  }

  createUpdate(update) {
    return new Promise((resolve, reject) => {
      this.UpdatesCollection
        .add({
          title: update.title,
          message: update.message,
          author: update.author,
          timestamp: Date.now()
        })
        .then(ref => resolve(ref.id))
        .catch(error => reject(new Error(error)))
    })
  }
}

module.exports = updatesCollectionModel