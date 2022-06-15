const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const { APP_PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, ARTERRA_BASE_URL } = require('./config');

const app = express();

// Use session memory store to save ARterra Labs access token for future user requests.
// You can choose to use any other server side or cookie/JWT storage implementation.
// Current memory storage implementation only for dev purposes and should not be used for production system
app.use(session({ secret: '4ire,+&1LM3)CD*ARterra{nft;#', resave: true, saveUninitialized: true }));

// you can send raw auth requests using axios or include some oauth2 library, e.g. passport-oauth2
app.use(passport.initialize());
passport.use(new OAuth2Strategy({
    authorizationURL: `${ARTERRA_BASE_URL}/oauth2-login`,
    tokenURL: `${ARTERRA_BASE_URL}/api/auth/oauth2-token`,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
  },
  (accessToken, refreshToken, accessTokenResponse, _, callback) => {
    console.log({ accessToken, refreshToken, accessTokenResponse });

    callback(
      null, // error
      accessTokenResponse.profile, // assigned by passport middleware to 'req.user' field
      { // assigned by passport middleware to 'req.authInfo' field
        accessToken,
        accessTokenExpiresIn: accessTokenResponse.expires_in,
        refreshToken,
        refreshTokenExpiresIn: accessTokenResponse.refresh_token_expires_in,
      });
  },
));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// redirect user to ARterra Labs sign-in page
app.get(
  '/api/arterra/login',
  passport.authenticate('oauth2', { session: false, state: 'e.g. userId from your app' }),
);

// receive back authorization code, exchange it to access token on server side
// and save it in session store for the current user
app.get(
  '/api/arterra/login-callback',
  passport.authenticate('oauth2', { session: false, failureRedirect: '/?oauth2-login=false' }),
  (req, res) => {
    console.log({
      user: req.user, // provided by passport-oauth2
      authInfo: req.authInfo, // provided by passport-oauth2: accessToken, refreshToken
      state: req.query.state, // any state you passed to preserve during authentication
    });

    // save ARterra Labs auth info in user session (cookie/JWT/any server side storage) linked to the user
    // to make future requests on behalf of the authenticated user to ARterra Labs API
    req.session.arterraAccessToken = req.authInfo.accessToken;
    req.session.arterraUser = req.user;

    res.redirect('/?oauth2-login=true');
  },
);

require('./common-routes')(app);

app.listen(APP_PORT, () => console.log(`App is running: http://127.0.0.1:${APP_PORT}`));