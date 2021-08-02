const express = require('express')
const router = express.Router()

router.use('/collectionDB', require('./collectionDB'))
router.use('/user', require('./user'))

router.use('/slug', require('./slug'))
router.use('/session', require('./session'))
module.exports = router
