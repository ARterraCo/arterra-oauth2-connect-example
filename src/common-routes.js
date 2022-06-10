const axios = require('axios');

const { ARTERRA_BASE_URL } = require('./config');

module.exports = function (app) {
  app.get('/api/arterra/protected-user-info', async (req, res) => {
    if (!req.session.arterraAccessToken) {
      return res.status(403).json({ message: 'ARterra access token not found in session' });
    }

    const arterraUserResponse = await axios.get(
      `${ARTERRA_BASE_URL}/api/auth/info`,
      { headers: { Authorization: `Bearer ${req.session.arterraAccessToken}` } },
    );

    res.status(arterraUserResponse.status).json(arterraUserResponse.data);
  });

  app.get('/api/arterra/user-collectibles', async (req, res) => {
    if (!req.session.arterraAccessToken) {
      return res.status(403).json({ message: 'ARterra access token not found in session' });
    }

    // you may use passport-http-bearer strategy to make this request under the hood
    // http://www.passportjs.org/packages/passport-http-bearer/
    const arterraUserResponse = await axios.get(
      `${ARTERRA_BASE_URL}/api/auth/info`,
      { headers: { Authorization: `Bearer ${req.session.arterraAccessToken}` } },
    );

    const userCollectibleResponse = await axios.get(
      `${ARTERRA_BASE_URL}/api/nft?owner=${arterraUserResponse.data.data.user.wallet}`,
      { headers: { Authorization: `Bearer ${req.session.arterraAccessToken}` } },
    );

    res.status(userCollectibleResponse.status).json(userCollectibleResponse.data);
  });

  app.get('/api/logout', (req, res) => {
    req.session && req.session.destroy(() => console.log('Session destroyed'));

    res.status(204).send();
  });
};