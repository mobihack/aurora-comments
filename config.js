module.exports = {
  token: process.env.GITHUB_TOKEN,
  repo: '<user/repo_name>',
  repo_docs: false,
  nested_replies: true,
  domains: [
    'http://localhost:4000',
    'https://example.com',
    'https://beta.example.com',
    'https://example.github.io'
  ],
  captcha: {
    status: true,
    secret: process.env.RECAPTCHA_SECRET_TOKEN,
    site: '<YOUR_RECAPTCHA_SITE_KEY>'
  },
  commit_message: 'Sync Comments.',
  moderation: false
}
