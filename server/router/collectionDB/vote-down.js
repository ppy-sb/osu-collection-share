const vote = require('../../controller/Collection/vote')
module.exports = async (req, res, next) => {
  try {
    res.json(await vote({ user: req.session.user, session: req.session, slug: req.params.slug, vote: -1 }))
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}