const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const router = express.Router()

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: process.env.SESSION_COLLECTION || 'sessions'
})
// Catch errors
store.on('error', function (error) {
  console.log(error)
})

router.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: false
}))

router.use((req, res, next) => {
  req.session.votes = req.session?.votes || []
  req.session.uploaded = req.session?.uploaded || []
  next()
})

module.exports = router
