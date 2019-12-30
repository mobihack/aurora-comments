module.exports = {
  token: process.env.GITHUB_TOKEN, // github token
  repo: 'mobihack/mobihack-portfolio', // repo name
  nested_replies: true,
  domains: [
    'http://localhost:4000',
    'https://mobihack.me',
    'https://beta.mobihack.me'
  ],
  captcha: {
    status: true,
    secret: process.env.RECAPTCHA_SECRET_TOKEN,
    site: '<YOUR_RECAPTCHA_SITE_KEY>' // Add site key here.
  }, // enable captcha using true
  commit_message: 'Sync Comments.',
  moderation: false // create pull request instead of updating repo
}
