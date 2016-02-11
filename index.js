'use strict';

const request = require('request-promise'),
      qs = require('querystring');

module.exports = (config) => {
  const authType = 'oauth2',
        clientSecret = config.secret,
        accessTokenUrl = 'https://graph.facebook.com/oauth/access_token',
        graphApiUrl = 'https://graph.facebook.com/me';

  let userId = null,
      userName = null,
      userEmail = null;

  return {
    getAuthType: () => {
      return authType;
    },

    getUserData: () => {
      return {
        userId,
        userName,
        userEmail
      };
    },

    authenticate: (req) => {
      const authData = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: clientSecret,
        redirect_uri: req.body.redirectUri
      };

      return request({ url: accessTokenUrl, qs: authData, json: true })
        .then((response) => {
          response = qs.parse(response);
          return request({ url: graphApiUrl, qs: { access_token: response.access_token }, json: true });
        })
        .then(function(response) {
          userId = response.id;
          userName = response.name;
          userEmail = response.email;
          return true;
        });
    }
  };
};
