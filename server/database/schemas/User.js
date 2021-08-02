const Mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const schema = new Mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  hashed: { type: Number, default: SALT_WORK_FACTOR }
})
schema.pre('save', (next) => {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) { return next() }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) { return next(err) }

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) { return next(err) }
      // override the cleartext password with the hashed one
      this.password = hash
      next()
    })
  })
})

module.exports = schema
