const express = require('express')
const router = express.Router()
router.get('/slug/*', require('../../api/slug'))

module.exports = router
