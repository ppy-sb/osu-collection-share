const slug = require('slug')

module.exports = async (t, model) => {
  const s = slug(t)
  const sameDBExists = await model.exists({ slug: s })
  let increase = 2
  if (sameDBExists) {
    while (await model.exists({ slug: slug(`${t}-${increase}`) })) {
      increase = increase + 1
    }
  }
  return {
    slug: s,
    sameCollectionDBExists: sameDBExists,
    nextAvailable: sameDBExists ? slug(`${t}-${increase}`) : undefined
  }
}
