const path = require('path');
const express = require('express');
const session = require('express-session');
const axios = require('axios');

const { APP_PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, ARTERRA_BASE_URL } = require('./config');

const app = express();

// Use session memory store to save ARterra Labs access token for future user requests.
// You can choose to use any other server side or cookie/JWT storage implementation
app.use(session({ secret: '4ire,+&1LM3)CD*ARterra{nft;#', resave: true, saveUninitialized: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// redirect user to ARterra Labs sign-in page
app.get('/api/arterra/login', (req, res) => {
  const query = new URLSearchParams({
    response_type: 'code', // or you can use 'signup' to open sign up page instead of sign in
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: 'e.g. user id from your app', // optional, any data you want to pass through auth flow
  });

  res.redirect(`${ARTERRA_BASE_URL}/oauth2-login?${query.toString()}`);
});

// receive back authorization code, exchange it to access token on server side
// and save it in session store for the current user
app.get('/api/arterra/login-callback', async (req, res) => {
  if (!req.query.code) {
    return res.redirect('/?oauth2-login=false');
  }

  const appCredentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const accessTokenResponse = await axios.post(
    `${ARTERRA_BASE_URL}/api/auth/oauth2-token`,
    { grant_type: 'authorization_code', code: req.query.code },
    {
      headers: {
        Authorization: `Basic ${appCredentials}`,
      },
    },
  );

  console.log({
    user: accessTokenResponse.data.profile,
    authInfo: {
      accessToken: accessTokenResponse.data.access_token,
      accessTokenExpiresIn: accessTokenResponse.data.expires_in,
      refreshToken: accessTokenResponse.data.refresh_token,
      refreshTokenExpiresIn: accessTokenResponse.data.refresh_token_expires_in,
    },
    state: req.query.state, // any state you passed to preserve during authentication
  });

  // save ARterra Labs auth info in user session (cookie/JWT/any server side storage) linked to the user
  // to make future requests on behalf of the authenticated user to ARterra Labs API
  req.session.arterraAccessToken = accessTokenResponse.data.access_token;

  res.redirect('/?oauth2-login=true');
});

require('./common-routes')(app);

app.listen(APP_PORT, () => console.log(`App is running: http://127.0.0.1:${APP_PORT}`));