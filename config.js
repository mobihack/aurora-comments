module.exports = {
  token: process.env.GITHUB_TOKEN,
  repos: {
    'mh-pf': {
      repo: 'mobihack/mobihack-portfolio',
      repo_docs: false,
      nested_replies: true,
      captcha_status: true
    },
    'aurora-demo': {
      repo: 'mobihack/aurora-comments',
      repo_docs: true,
      nested_replies: true,
      captcha_status: true
    }
  },
  domains: [
    'http://localhost:4000',
    'https://mobihack.me',
    'https://mobihack.github.io'
  ],
  captcha: {
    secret: process.env.RECAPTCHA_SECRET_TOKEN,
    site: '6LcTyyYUAAAAAH5OOPE3J2TSNqd9SEU8QVL8nd0L'
  },
  commit_message: 'Sync Comments.'
}
