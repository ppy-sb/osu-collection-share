const express = require('express')
const router = express.Router()

router.post('/upload', express.json({ limit: '50mb' }), require('./upload'))
router.get('/search/:name', require('./search'))
router.get('/get/:slug', require('./read'))
router.get('/recent', require('./recent'))
router.get('/top', require('./most-viewed'))
router.get('/:slug/vote/up', require('./vote-up'))
router.get('/:slug/vote/down', require('./vote-down'))
router.get('/:slug/vote/unvote', require('./vote-unvote'))
module.exports = router
