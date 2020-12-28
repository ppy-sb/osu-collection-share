const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/upload', bodyParser.json({ limit: '50mb' }), require('../api/collectionDB/upload'))
router.get('/search/:name', require('../api/collectionDB/search'))
router.get('/get/:slug', require('../api/collectionDB/read'))
router.get('/recent', require('../api/collectionDB/recent'))
router.get('/top', require('../api/collectionDB/top'))

module.exports = router
