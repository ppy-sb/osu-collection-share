const fs = require('fs')
const express = require('express')
// const session = require('express-session')

const app = express()
// const isProd = process.env.NODE_ENV === 'production'
const port = process.env.API_LISTEN || process.env.PORT || 3000

// const sess = {
//   secret: 'keyboard cat',
//   cookie: {},
//   resave: false,
//   saveUninitialized: false
// }
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  // sess.cookie.secure = true // serve secure cookies
}
// 用指定的配置对象实例化 Nuxt.js
// const config = require('../nuxt.config.js')
// config.dev = !isProd

// app.use((req, res, next) => {
//   console.log(req.url)
//   console.log(req.query)
//   return next()
// })
// app.use(session(sess))
// app.use(express.static('../static'))
app.use('/api', require('./api'))

listen()
function listen () {
  if (process.env.API_SCHEME?.startsWith('unix') && fs.existsSync(port)) {
    fs.unlinkSync(port)
  }
  // 服务端监听
  const server = app.listen(port)
  console.log(`Server listening on ${port}`)

  function shutdown () {
    server.close()
    process.exit()
  }
  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, shutdown.bind(null, eventType))
  })
}

app.use(require('./errorHandler'))
