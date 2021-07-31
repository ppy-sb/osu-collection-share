const express = require('express')
const router = express.Router()

router.use('/collectionDB', require('./collectionDB'))
router.use('/user', require('./user'))

router.get('/slug/*', require('./slug'))
module.exports = router
