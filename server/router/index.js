const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/collectionDB/*', bodyParser.json({ limit: '50mb' }), require('./collectionDB'))
router.get('/slug/*', require('./slug'))

module.exports = router
