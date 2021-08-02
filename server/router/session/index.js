const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json(req.session)
})
router.get('/votes', (req, res) => {
  res.json(req.session.votes)
})

router.get('/p', (req, res) => {
  console.log(req.session)
})

module.exports = router
