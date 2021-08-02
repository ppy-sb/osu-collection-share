const express = require('express')
const app = express()

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}
app.use(require('./session'))
app.use('/api', require('./router'))

module.exports = app
