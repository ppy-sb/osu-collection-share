const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/collectionDB/upload', bodyParser.json({ limit: '50mb' }), require('./upload'))
router.get('/collectionDB/:slug', require('./read'))
router.get('/slug/*', require('./slug'))

module.exports = router
