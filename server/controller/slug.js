// import randomString from '~universal/randomString'
const slug = require('slug')
const randomString = require('~universal/randomString')
module.exports = async (t, model) => {
  if (!t) {
    t = randomString()
  }
  const s = slug(t)
  const sameDBExists = await model.exists({ slug: s })
  let random = randomString()
  if (sameDBExists) {
    while (await model.exists({ slug: slug(`${t}-${random}`) })) {
      random = randomString()
    }
  }
  return {
    slug: s,
    sameCollectionDBExists: sameDBExists,
    nextAvailable: sameDBExists ? slug(`${t}-${random}`) : undefined
  }
}
