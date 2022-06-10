This project provides several examples on how to connect [ARterra Labs API](https://staging.arterra.co/api/api/)
and configure [OAuth2.0](https://auth0.com/intro-to-iam/what-is-oauth-2/) authentication.
You can go through the code workflow of redirecting user to ARterra Labs auth page, receiving authorization code
and exchanging it to access token.<br/>
Current example works with [sandbox ARterra Labs](https://staging.arterra.co) platform,
but you can change config values and test it with [live env](https://app.arterra.co) either.

There are two examples written in JavaScript:
- make API request with axios without any libraries `src/app-raw-axios-auth.js`
- passport-oauth2 library `src/app-passport-oauth2-auth.js`

When running this application locally you can test how it works with minimum set up
because in `src/config.js` it has preconfigured client credentials to the sandbox environment. <br/>
You can test your client credentials as well, the process how to do this is described further.

At first, you will need to set up proper config values in `src/config.js`
- `APP_PORT` - Application port to run the example, by default it is `http://127.0.0.1:3000` but you can choose any of your choice 
- `CLIENT_ID` - ARterra Labs API client id. You can find it on Business Partner Admin Panel page
- `CLIENT_SECRET` - ARterra Labs API client secret. You can find it on Business Partner Admin Panel page
- `REDIRECT_URI` - Redirect URI that is configured on Business Partner Admin Panel page.
I propose not to edit this field, but you need to create additional client credentials exactly for this example and use URL from this config
- `ARTERRA_BASE_URL` - either live or sandbox ARterra Labs environment

For the purposes of this example you may want to create separate client credentials
because you will need to use the same redirect uri both in this example and have configured on ARterra Labs BP Admin Panel page 

Also, it is very important to keep `CLIENT_SECRET` only on backend side
because otherwise it can be stolen from frontend side!<br/>
Currently, ARterra Labs API does not have `client_credentials` grant type for OAuth2.0 authentication
but in future we may add some API calls that will require 3rd party authorization instead of requesting user's access token. 

# Example app overview
Both examples (axios and passport-oauth2) use the same UI stored in `src/index.html` file:



By clicking on `Login via ARterra Labs` you will be redirected to the ARterra Auth page 
where it is possible either to sign-in using existing user credentials or sign-up a new user.

## Prepare example environment
```shell
# clone git repo
git clone ...
cd ...

# install dependencies
npm install
```

After project is loaded please configure config values for correct work
```shell
vi src/config.js
```

## Axios example app
This example uses plain [Axios](https://www.npmjs.com/package/axios) library to make all required OAuth 2.0 request to the ARterra Labs API.
```shell
# Start application
node src/app-raw-axios-auth.js
# or
npm start
# or
npm run start-raw-axios
```


## passport-oauth2 example app
This example uses [Passport.js](https://www.passportjs.org/) library together with 
[passport-oauth2](http://www.passportjs.org/packages/passport-oauth2/) strategy

```shell

# Start application
node src/app-passport-oauth2-auth.js
# or
npm run start-oauth2-passport
```

