const mongoose = require('../server/database/connect')
const db = require('../server/database/models')
const c = mongoose.connection
c.on('error', function (err) {
  console.error('Failed to connect to database', err)
  process.exit(1)
})
c.once('open', async function () {
  console.info('Connected to database')
  await db.CollectionDB.find({}).exec().then(res => Promise.all(res.map(async (doc) => {
    const user = await db.User.findOne(doc.user).exec()
    console.log(user)
    if (!user || user.anonymous) { return }
    if (!doc.uploader.name) {
      // doc.uploader = {
      //   name: user.name,
      //   link: `https://osu.ppy.sh/users/${user.name}`
      // }
      doc.uploader.name = user.name
      doc.uploader.link = user.id > 0 ? `https://osu.ppy.sh/users/${user.id}` : `https://osu.ppy.sh/users/${user.name}`
      if (user.id > 0) { doc.uploader.avatar = 'https://a.ppy.sh/' + user.id }
    }
    doc.user = {
      anonymous: true
    }
    await doc.save()
  })))
  process.exit(0)
})
