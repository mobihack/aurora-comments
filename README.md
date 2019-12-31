![Aurora - static comments system.](docs/assets/images/banner.png)

# Aurora Comment

> A `ZEIT Now` ready Github based commenting system.

## Features
 - Static Comments.
 - Multiple website setup.
 - Nested comments.
 - reCaptcha

## Prerequisite

 - [`now-cli`](https://zeit.co/download)
 - [Github Personal Access Token](https://github.com/settings/tokens)
    - The generated token must have full repo acccess
 - [Recaptcha Keys](https://www.google.com/recaptcha/)
    - Currently using reCaptcha v2.

## Installation

You can deploy Aurora Comments in two ways:
 1) Deploy directly to `ZEIT Now`.
    - Use this if what you only need is a comments system. 
 2) Setup a development setup and deploy to `ZEIT Now`.
    - Use this if what you need a locally hosted version.
    - Use this if you are making changes to source code.
  
Installation using both ways need the tokens to be set as [secrets](https://zeit.co/docs/v2/environment-variables-and-secrets).

## Adding Secrets

Add Github Personal Access Token:
```sh
 now secrets add GITHUB_TOKEN <YOUR_GITHUB_TOKEN>
 ```
Add reCaptcha Secret Key:
 ```sh
 now secrets add RECAPTCHA_SECRET_TOKEN <YOUR_RECAPTCHA_SECRET_TOKEN>
 ```

### Deploy directly to `ZEIT Now`

![Deploying directly to ZEIT Now.](docs/assets/images/now-deploy.gif)

Click to [Deploy directly to ZEIT Now](https://zeit.co/new/project?template=https://github.com/mobihack/aurora-comments/).

Make sure to create a fork of the repository. The repository being private or public doesn't matter. After forking the repository, edit the config.js file with your details and reCaptcha site key. The changes will be automatically deployed by `ZEIT Now`


### Development setup and deploy to `ZEIT Now`

1) Clone this repository.

 ```sh
 git clone https://github.com/mobihack/aurora-comments.git
 ```

2) Rename `.env.sample` to `.env`.
3) Edit `.env`.
 - Add your Github Personal Access Token.
 - Add your reCaptcha secret key.
 4) Edit config.js and add your reCaptcha site key.

## Configurations (config.js)
```js

module.exports = {
  token: process.env.GITHUB_TOKEN,
  repos: {
    'example': { // your sitename
      repo: 'user/repo_name', // your repository name
      repo_docs: false,
      nested_replies: true, // set true to enable nested replies for this site
      captcha_status: true  // set true to enable captcha for this site
    }
  },
  domains: [
    /* CORS - Allowed domain list */
    'http://localhost:4000',
    'https://example.com',
    'https://beta.example.com',
    'https://example.github.io'
  ],
  captcha: {
    secret: process.env.RECAPTCHA_SECRET_TOKEN,
    site: '<YOUR_RECAPTCHA_SITE_KEY>' // Your reCaptcha site key.
  },
  commit_message: 'Sync Comments.' // Commit Message for push operation.
}

```

## Development Setup

Use this example to start a development instance.

```sh
now dev
```

Tokens will be read from `.env` file.

## Production Setup

Use this example to push code to production.

```sh
now --prod
```

Secrets must be set in advance.

## API Requests
  - `GET /`
    - Shows info about Aurora Comments.
  - `OPTIONS /`
    - Pre-flight request response.
  - `POST /`
    - Accepts data and saves a comment.
    - Params:
      - `name`: User name of comment.
      - `message`: Message of comment.
      - `parent_id`: Parent ID of comment if it is a reply to another comment. 0 if it is a top-level comment.
      - `slug`: URL slug (identifier) of post.
      - reCaptcha data string if captcha is enabled.
      

## API Response

All API transactions will have an Response of this format.

```json
{
 "success": true,
 "code": "success"
}
```
```json
{
 "success": false,
 "code": "error-code",
 "message": "Error Message."
}
```
### `success`
True if the transaction was successful, false if not.

### `code`
| Output               | Description                                    | Error     |
| -------------------- | ---------------------------------------------- | --------- |
| insufficient-inputs  | Inputs needed were not supplied.               |     ✔️     |
| recaptcha-error      | reCaptcha error.                               |     ✔️     |
| repo-not-configured  | The named site was not found in `config.repo`  |     ✔️     |
| repo-not-specified   | A named site was not sent in the POST params.  |     ✔️     |
| success              | OK / Success.                                  |     ❌     |

### `message`
Gives an error message if the error-code is ambigous.

## FAQ
Some Frequently Asked Questions and their answers.

### How can I use this with Jekyll or any static?
The goal of Aurora is only to provide endpoints to easily allow comments in a static website. The client side of the code could change according to their own use. So it is upto their own self to create the client side script. Please check [Example](./docs/_include/comments.html) to see a simple implementation using `XMLHttpRequest` and DOM Manipulation.

### Do you have plans for a standard client library?
Yes, I do have. But an ETA is not available.

### Should I disable catcha?
Captcha can be disabled but it is not recommended. An exposed endpoint can lead to token abuse.

### Why is a site name used instead of sending the repo name directly?
Using a site name helps to avoid showing the repository name if it is private.

### Why `ZEIT Now`?
`ZEIT Now` is an easy to deploy tool with a free plan that can easily handle our workload.

## Contributing

You are more than welcome to contribute to the project.

To contribute:

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Use Development Server to check changes.
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Donation
If this project help you reduce time to develop, you can give me a cup of coffee :) 

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EKLDUBPHHLRE4&source=url)

