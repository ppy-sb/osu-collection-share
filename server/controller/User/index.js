const User = require('~models').User
class UserController {
  static async findOrCreateUser (user) {
    const _user = await User.findOne(user).exec()
    if (_user) { user = _user } else { user = await User.create(user) }

    return user
  }
}

module.exports = UserController
