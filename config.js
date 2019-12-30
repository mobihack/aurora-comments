module.exports = {
  token: process.env.GITHUB_TOKEN,
  repo: '<user/repo_name>',
  nested_replies: true,
  domains: [
    'http://localhost:4000',
    'https://example.com',
    'https://beta.example.com'
  ],
  captcha: {
    status: true,
    secret: process.env.RECAPTCHA_SECRET_TOKEN,
    site: '<YOUR_RECAPTCHA_SITE_KEY>'
  },
  commit_message: 'Sync Comments.',
  moderation: false
}
