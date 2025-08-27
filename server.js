require('dotenv').config()
require('./config/Database/mongodb')
const generalResponse = require('./utils/response')
const httpCodes = require('./utils/httpCodes')
const { color, log } = require('console-log-colors')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin.routes')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')
const morgan = require('morgan')
const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const helperFunctions = require('./helper/admin/user')
const cookie = require('cookie-session')
const methodOverride = require('method-override')
const useragent = require('express-useragent')
const Locales = require('./config/locals')
const stripe = require('stripe')(process.env.stripeSecretKey)
const endpointSecret = 'whsec_hTcWEUgM66xX5XZBRlakVDtf20iw0kb2'
app.use(methodOverride('_method'))
require('events').EventEmitter.prototype._maxListeners = 100
// eslint-disable-next-line n/no-path-concat
app.use('/node_modules', express.static(__dirname + '/node_modules/'))
app.use(useragent.express())
const UserModel = require('./models/User')

app.post(
  '/api/v1/stripeWebhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    } catch (err) {
      console.log('Error in webhook signature verification:', err)
      return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object
        const customerId = subscription.customer

        const user = await UserModel.findOne({ stripeCustomerId: customerId })

        if (!user) {
          console.error('No user found for stripeCustomerId:', customerId)
          return response.status(404).send('User not found')
        }

        // TODO: Implement subscription handling when required models are available
        console.log('Subscription updated for customer:', customerId)

        return response.status(200).send('Webhook processed successfully')
      }

      // Handle unknown event types
      console.log('Unhandled event type:', event.type)
      return response.status(200).send('Webhook processed successfully')
    } catch (err) {
      console.error('Error processing webhook event:', err)
      return response.status(500).send('Internal Server Error')
    }
  }
)

app.use(
  bodyParser.json({
    limit: '100mb'
  })
)

app.use(
  bodyParser.urlencoded({
    limit: '100mb',
    extended: true
  })
)

app.use(
  cookie({
    maxAge: 24 * 60 * 60 * 60,
    keys: [process.env.cookieKeys]
  })
)
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

app.use(cors('*'))
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      fallbackLng: 'en',
      ns: Locales.list,
      defaultNS: Locales.list,
      backend: {
        // eslint-disable-next-line n/no-path-concat
        loadPath: path.join(__dirname + '/locales/{{lng}}/{{ns}}.json'),
        crossDomain: true
      }
    },
    (err, t) => {
      if (err) return console.log('something went wrong loading', err)
      // console.log('Translations loaded')
    }
  )

app.use(i18nextMiddleware.handle(i18next))
/***
 *
 *  End of the i18n
 *
 */

/**
 *
 * Setting up sessions for the Passport Js
 */
app.use(
  session({
    // TODO: Configure Redis store when redis service is available
    saveUninitialized: false,
    secret: process.env.SECRET,
    resave: false
  })
)

app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/**
 *
 * End of the sessions
 */
app.set('views', [path.join(__dirname, 'views')])
app.set('layout', 'layouts/admin')
app.use(expressLayouts)
app.set('view engine', 'ejs')

/**
 * Adding the helper funciton for the admin panel
 */

app.locals.booleanCheck = helperFunctions.booleanCheck
app.locals.conditionalTD = helperFunctions.conditionalTD
app.locals.dateFormater = helperFunctions.dateFormater
app.locals.dateOfBirth = helperFunctions.dateOfBirth
app.locals.validateImage = helperFunctions.validateImage
app.locals.ifElseCondition = helperFunctions.ifElseCondition
app.locals.role = helperFunctions.role

/***
 * express for the css and bootstrap files
 * images and etc
 */
/* eslint-disable */
app.use(express.static(__dirname + '/public'))

const server = app.listen(process.env.PORT, () => {
  log(color.yellow(' ******************************************** '))
  log(color.yellow(' *******                              ******* '))
  log(
    color.yellow(
      ` *******   Server started at ${process.env.PORT}     ******* `
    )
  )
  log(color.yellow(' *******                              ******* '))
  log(color.yellow(' ******************************************** '))
})

/**
 *
 *
 * Connecting to the socket
 */
const allRoutes = require('./routes/router')

/***
 *
 *
 * Swagger Setup
 */

// settinig all the routes
app.use('/api/v1', allRoutes)
app.use('/admin', adminRoutes)

const swaggerOption = {
  definition: {
    info: {
      title: 'Swapify',
      version: '1.0.0',
      description: "It's a Secret"
    },
    securityDefinitions: {
      BearerAuthentication: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
    requestInterceptor: (request) => {
      request.headers.Origin = '*'
      return request
    },
    host: `${process.env.BASE_URL}`,
    schemes: ['https', 'http']
  },
  apis: [
    'server.js',
    './routes/api/v1/*/*.routes.js',
    './routes/admin/*.routes.js'
  ],
  basePath: '/v1'
}
const swaggerUiOptions = {
  explorer: true
}

const swaggerDocs = swaggerJsdoc(swaggerOption)

const swaggerApp = express()
swaggerApp.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
)

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
)

app.get('/', async (req, res) => {
  generalResponse.successResponse(res, httpCodes.OK, {
    status: true,
    message: 'Swapify'
  })
})

app.all('*', async (req, res) => {
  generalResponse.successResponse(res, httpCodes.OK, {
    status: false,
    message: 'If you are facing this thats mean you have entered wrong Route'
  })
})
module.exports = app
