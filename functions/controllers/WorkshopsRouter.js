const express = require('express')

const WORKSHOPS = require('../constants/Workshops')

class WorkshopsRouter {
  constructor() {
    this.router = express.Router()
    this.initRoutes()
  }

  initRoutes() {
    //  GET /workshops
    this.router.get('/', (req, res) => {
      res
        .status(200)
        .send({
          message: '/workshops endpoint is live'
        })
    })

    //  GET /workshops/all
    this.router.get('/all', (req, res) => {
      res
        .status(200)
        .send({
          message: 'Successfully got all workshops!',
          data: {
            workshops: WORKSHOPS
          }
        })
    })
  }

  get routes() {
    return this.router
  }
}

module.exports = WorkshopsRouter