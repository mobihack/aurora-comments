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
  origin: config.domains
}

// READ Request Handlers
app.get('/', (req, res) => {
  res.json(
    {
      success: true,
      error_code: 'success',
      message: 'Aurora Comments System / https://github.com/mobihack/aurora-comments/'
    })
})

// enable pre-flight request for post request
app.options('/', cors(corsOptions))

app.post('/', cors(corsOptions), (req, res) => {
  if (req.body.sitename === 'undefined' || !req.body.sitename) {
    res.json({
      success: false,
      code: 'repo-not-specified'
    })
  } else if (config.repos[req.body.sitename] === 'undefined') {
    res.json({
      success: false,
      code: 'repo-not-configured'
    })
  } else if (typeof req.body.name !== 'undefined' && req.body.name &&
    typeof req.body.message !== 'undefined' && req.body.message &&
    typeof req.body.slug !== 'undefined' && req.body.slug &&
    typeof req.body.parent_id !== 'undefined') {
    var ghrepo = client.repo(config.repos[req.body.sitename].repo)
    var date = new Date()
    var uuidslug = uuidv1()
    var filename = '_data/comments/' + uuidslug + '.json'
    if (config.repos[req.body.sitename].repo_docs) {
      filename = 'docs/' + filename
    }
    var data = JSON.stringify({
      id: uuidslug,
      type: 'user',
      message: req.body.message,
      name: req.body.name,
      slug: req.body.slug,
      date: date.toISOString(),
      parent_id: (config.repos[req.body.sitename].nested_replies ? req.body.parent_id : 0)
    })
    // if captcha is on in config.
    if (config.repos[req.body.sitename].captcha_status) {
      recaptcha.verify(req, function (rerror) {
        if (rerror == null) {
          ghrepo.createContents(filename, config.commit_message, data, function () {
            res.json({
              success: true,
              code: 'success'
            })
          })
        } else {
          res.json({
            success: false,
            code: 'recaptcha-error',
            message: rerror
          })
        }
      })
    } else {
      // if captcha is not on in config.
      ghrepo.createContents(filename, config.commit_message, data, function () {
        res.json({
          success: true,
          code: 'success'
        })
      })
    }
  } else {
    res.json({
      success: false,
      code: 'insufficient-inputs'
    })
  }
})

// PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}..`))
