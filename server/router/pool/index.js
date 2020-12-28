const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/upload', bodyParser.json({ limit: '50mb' }), require('../api/pool/upload'))
router.get('/search/:name', require('../api/pool/search'))
router.get('/get/:slug', require('../api/pool/read'))
router.get('/recent', require('../api/pool/recent'))
router.get('/top', require('../api/pool/top'))

module.exports = router
