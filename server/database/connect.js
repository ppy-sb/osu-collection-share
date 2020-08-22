const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI || 'mongodb://localhost/users', { useNewUrlParser: true })
module.exports = mongoose
