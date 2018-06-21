const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()

const REDASH_URL = process.env.REDASH_URL || 'https://app.redash.com'
const REDASH_API_KEY = process.env.REDASH_API_KEY
const PORT = process.env.PORT || 3000

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

app.use(express.static('dist'))

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`app listening on port ${PORT}!`)
})