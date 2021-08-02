const express = require('express')
const router = express.Router()

router.get('/testLogin', (req, res) => {
  req.session.user = {
    name: 'arily'
  }
  res.json(req.session)
})
module.exports = router
