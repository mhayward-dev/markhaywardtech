const functions = require('firebase-functions');
const axios = require('axios');
const qs = require('qs');

exports.getSpotifyToken = functions
    .region('europe-west2')
    .https.onRequest(async (req, res) => {
      // Supply a refresh token from the Spotify token request API
      // Also allow us to hide our secrets in Firebase environment variables
      // https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-flows

      const secrets = functions.config().markhaywardtech;
      const basicAuth = Buffer.from(`${secrets.spotify_client_id}` +
            `:${secrets.spotify_client_secret}`).toString('base64');
      const data = qs.stringify({
        'refresh_token': secrets.spotify_refresh_token,
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
            res.status(200).send(r.data);
          })
          .catch((e) => {
            console.log(e);
            res.sendStatus(500);
          });
    });


