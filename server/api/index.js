const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.post('/collectionDB/upload', bodyParser.json({ limit: '50mb' }), require('./collectionDB/upload'))
router.get('/collectionDB/search/:name', require('./collectionDB/search'))
router.get('/collectionDB/get/:slug', require('./collectionDB/read'))
router.get('/collectionDB/recent', require('./collectionDB/recent'))
router.get('/collectionDB/top', require('./collectionDB/most-viewed'))
router.get('/slug/*', require('./slug'))

module.exports = router
