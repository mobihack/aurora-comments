const express = require('express')
var cors = require('cors')
const app = express()
const config = require('./config')
const uuidv1 = require('uuid/v1')

var Recaptcha = require('express-recaptcha').RecaptchaV2
var recaptcha = new Recaptcha(config.captcha.site, config.captcha.secret)

var github = require('octonode')
var client = github.client(config.token)
var ghrepo = client.repo(config.repo)

app.use(express.json())

var corsOptions = {
  origin: function (origin, callback) {
    if (config.domains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// READ Request Handlers
app.get('/', (req, res) => {
  res.json('A simple comment server.')
})

app.options('/', cors()) // enable pre-flight request for post request
app.post('/', cors(corsOptions), (req, res) => {
  if (typeof req.body.name !== 'undefined' && req.body.name &&
    typeof req.body.message !== 'undefined' && req.body.message &&
    typeof req.body.slug !== 'undefined' && req.body.slug &&
    typeof req.body.parent_id !== 'undefined') {

    var date = new Date()
    var uuidslug = uuidv1()
    var filename = '_data/comments/' + Date.now() + uuidslug + '.json'
    var data = JSON.stringify({
      id: uuidslug,
      type: 'user',
      message: req.body.message,
      name: req.body.name,
      slug: req.body.slug,
      date: date.toISOString(),
      parent_id: (nested_replies ? req.body.parent_id : 0)
    })
    if (config.captcha.status) { // if recaptcha is on
      recaptcha.verify(req, function (rerror, rdata) {
        if (rerror == null) {
          ghrepo.createContents(filename, config.commit_message, data, function () {
            res.json({
              error_code: 'success'
            })
          })
        } else {
          res.json({
            error_code: 'recaptcha_error',
            error_msg: rerror
          })
        }
      })
    } else {
      ghrepo.createContents(filename, config.commit_message, data, function () {
        res.json({
          error_code: null
        })
      })
    }
  } else {
    res.json({
      error_code: 'insufficient-inputs'
    })
  }
})

// PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}..`))
