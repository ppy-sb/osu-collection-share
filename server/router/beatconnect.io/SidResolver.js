const express = require('express')
const axios = require('axios')
// const cors = require('cors')
const router = express.Router()

// router.use(cors({
//   origin: ['http://beatconnect.io', 'https://beatconnect.io']
// }))
router.get('/download/full/:sid', async (req, res, next) => {
  // guard & sid type enforce
  if (!req.params.sid) return next(new Error('sid required'))
  let sid = req.params.sid
  if (isNaN(sid)) return next(new Error('sid must be a number'))
  sid = Number(sid)
  if (!Number.isInteger(sid)) return next(new Error('sid must be an integer'))

  // api params check
  if (!process.env.BEATCONNECT_API_SECRET) return next(new Error('missing beatconnect api key. Try other source'))
  if (!process.env.BEATCONNECT_API_BASE) return next(new Error('missing beatconnect api path. Try other source'))
  if (!process.env.BEATCONNECT_BASE) return next(new Error('missing beatconnect website path. Try other source'))

  try {
    const result = await axios.get(`${process.env.BEATCONNECT_API_BASE}/beatmap/${sid}`, { params: { token: process.env.BEATCONNECT_API_SECRET } })
      .then(res => res.data)
    const uniqueId = result.unique_id

    res.redirect(301, `${process.env.BEATCONNECT_BASE}/b/${sid}/${uniqueId}/`)
    // res.json({ uniqueId })
    // res.redirect(301, `https://dl.sayobot.cn/beatmaps/download/novideo/${sid}`)
  } catch (error) {
    return next(new Error('beatconnect api request failed. ' + error.message))
  }
})
module.exports = router
