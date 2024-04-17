const functions = require('firebase-functions');
const axios = require('axios');
const qs = require('qs');

const config = functions.config().markhaywardtech;
const whitelist = config.whitelisted_endpoints.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const cors = require('cors')(corsOptions);

exports.getSpotifyToken = functions
    .region('europe-west2')
    .https.onRequest(async (req, res) => {
      // wrap in CORS to whitelist who can call our API
      cors(req, res, () => {
      // Supply a refresh token from the Spotify token request API
      // Also allow us to hide our secrets in Firebase environment variables
      // https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-flows

        const basicAuth = Buffer.from(`${config.spotify_client_id}` +
            `:${config.spotify_client_secret}`).toString('base64');
        const data = qs.stringify({
          'refresh_token': config.spotify_refresh_token,
          'grant_type': 'refresh_token',
        });

        axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: data,
        })
            .then((r) => {
              res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
              res.set('Access-Control-Allow-Origin', req.headers.origin);
              res.status(200).send(r.data);
            })
            .catch((e) => {
              console.log(e);
              res.sendStatus(500);
            });
      });
    });


