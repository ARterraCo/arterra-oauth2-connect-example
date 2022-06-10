const APP_PORT = 3000;

module.exports = {
  APP_PORT,
  // https://staging.arterra.co/profile/ykuznets_surftest1 (admin of sandbox Surf Planet business partner)
  CLIENT_ID: 'client_475ed119', // Use your BP client id. Surf Planet business partner client id.
  CLIENT_SECRET: 'secret_a5ee033782be4636cbefc8', // Use your BP client secret
  REDIRECT_URI: `http://127.0.0.1:${APP_PORT}/api/arterra/login-callback`,
  ARTERRA_BASE_URL: 'https://staging.arterra.co',
  // to use `https://app.arterra.co` make sure that you have created client credentials on live env
};