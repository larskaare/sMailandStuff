# sMailandStuff

[![Azure Pipeline Build Status](https://lksk.visualstudio.com/sMailandStuff/_apis/build/status/larskaare.sMailandStuff?branchName=master)](https://lksk.visualstudio.com/sMailandStuff/_build/latest?definitionId=1&branchName=master)

A web application to test various features in web applications, integration to DevOps tools and cloud deployments.

## Features

- oAuth2 and OICD against Azure AD
- Reading email from o365 Graph
- Expose various token related information for user/session
- Exploring cookie beaviour for displaying last time visited on a few pages
- Docker multi-stage build
- Support for ESLint
- Security headers like CSP
- Automated tests

## Install and run locally

- Clone repository
- Do `npm install`
- Create `Application registration` in Azure AD
- Update configuration in `./config/config.js`
- Export the following config into the local environment variables

```bash
export NODE_ENV=development
export CLIENTSECRET=""
export PORT=3000
export TENANTID=""
export CLIENTID=""
```

- Run application using `npm start`

### Test

The the application by running `npm test`

### Linting

Lint the code by running `npm run lint`

### Using nodemon

Using nodemon will automatically restart the application when a change is observed in a javascript file.

To develop using nodemon run `npm run nodemon`

## Docker

- Build: `docker build -t smailandstuff .`
- Run:

```bash
docker run -p 3000:3000  \
    --env TENANTID="" \
    --env CLIENTID="" \
    --env CLIENTSECRET="" \
    smailandstuff
```

## Cloud Deployment

### Radix

Radix lives at <https://www.radix.equinor.com>

- Examine and update `./radixconfig.yaml`
- (Apply for access to the Radix playground)
- Create new application in the Radix Playground
- Inject the CLIENTSECRET using the Radix Web Console

(Current version of code uses memory to as session store. This will not scale beyond one app instance and it will leak memory. This set-up is not recommended for ***real*** production scenarios)

### Azure DevOps (tbd)
