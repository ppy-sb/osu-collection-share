const express = require('express')
const models = require('~models')
const getSlug = require('~controllers/slug')
const router = express.Router()

router.get('/:slug', async (req, res, next) => {
  const target = req.params.slug || undefined
  // if (target === undefined) { next(Error('slug required')) }
  const model = models.CollectionDB
  const result = await getSlug(target, model)
  res.json(result)
})

module.exports = router
