const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/pool/upload', bodyParser.json({ limit: '50mb' }), require('./pool/upload'))
router.get('/pool/search/:name', require('./pool/search'))
router.get('/pool/get/:slug', require('./pool/read'))
router.get('/pool/recent', require('./pool/recent'))
router.get('/pool/top', require('./pool/top'))
router.get('/slug/*', require('./slug'))

module.exports = router
