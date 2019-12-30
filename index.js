const express = require('express')
var cors = require('cors')
const app = express()
const config = require('./config')
const uuidv1 = require('uuid/v1')

var Recaptcha = require('express-recaptcha').RecaptchaV2
var recaptcha = new Recaptcha(config.captcha.site, config.captcha.secret)

var github = require('octonode')
var client = github.client(config.token)

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

// enable pre-flight request for post request
app.options('/', cors())

app.post('/', cors(corsOptions), (req, res) => {
  if (req.body.sitename === 'undefined' || !req.body.sitename) {
    res.json({
      error_code: 'repo-not-specified'
    })
  } else if (config.repos[req.body.repo] !== 'undefined') {
    res.json({
      error_code: 'repo-not-configured'
    })
  } else if (typeof req.body.name !== 'undefined' && req.body.name &&
    typeof req.body.message !== 'undefined' && req.body.message &&
    typeof req.body.slug !== 'undefined' && req.body.slug &&
    typeof req.body.parent_id !== 'undefined') {
    var ghrepo = client.repo(config.repos[req.body.repo].repo)
    var date = new Date()
    var uuidslug = uuidv1()
    var filename = (config.repos[req.body.repo].repo_docs ? 'docs/' : null) + '_data/comments/' + uuidslug + '.json'
    var data = JSON.stringify({
      id: uuidslug,
      type: 'user',
      message: req.body.message,
      name: req.body.name,
      slug: req.body.slug,
      date: date.toISOString(),
      parent_id: (config.repos[req.body.repo].nested_replies ? req.body.parent_id : 0)
    })
    // if captcha is on in config.
    if (config.repos[req.body.repo].captcha.status) {
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
      // if captcha is not on in config.
      ghrepo.createContents(filename, config.commit_message, data, function () {
        res.json({
          error_code: 'success'
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
