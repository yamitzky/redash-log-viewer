const express = require('express')
const axios = require('axios')
const app = express()

const REDASH_URL = process.env.REDASH_URL || 'https://app.redash.com'
const REDASH_API_KEY = process.env.REDASH_API_KEY

const client = axios.create({ baseURL: REDASH_URL })
client.defaults.headers.common['Authorization'] = `Key ${REDASH_API_KEY}`

app.all('/api/*', (req, res) => {
  client.request({
    method: req.method,
    url: `${req.originalUrl}`,
  })
    .then((response) => {
      res.json(response.data)
    })
    .catch((err) => {
      if (err.response) {
        res.status(err.response.status).send(err.response.data)
      } else {
        res.status(500).send(err.message)
      }
    })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})