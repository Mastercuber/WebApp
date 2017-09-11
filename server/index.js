import { Builder, Nuxt } from 'nuxt'
import express from 'express'
import bodyParser from 'body-parser'
import expressHealthcheck from 'express-healthcheck'

const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

import Raven from 'raven'
if (process.server) {
  // LOGGING IS ENABLED
  console.log('SENTRY LOGGING IS ENABLED')

  // Must configure Raven before doing anything else with it
  Raven.config('https://b26378911a9f4d1fb0e83a418f6241e7@sentry.io/213871', {
    release: process.env.RELEASE,
    environment: process.env.NODE_ENV,
    extra: {
      ssr: true
    }
  }).install()

  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler())
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler())
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/healthcheck', expressHealthcheck())

// Init Nuxt.js
const nuxt = new Nuxt(config)

app.set('port', config.env.PORT)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)
// Listen the server
app.listen(config.env.PORT, config.env.HOST)
console.log('Server listening on ' + config.env.HOST + ':' + config.env.PORT) // eslint-disable-line no-console
