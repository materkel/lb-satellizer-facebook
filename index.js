'use strict';

const request = require('request-promise'),
      qs = require('querystring');

module.exports = (config) => {
  const authType = 'oauth2',
        clientSecret = config.secret,
        accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token',
        graphApiUrl = 'https://graph.facebook.com/v2.5/me';

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
        .then(res => {
          return request({
            url: graphApiUrl,
            qs: {
              access_token: res.access_token,
              fields: 'id,name,email'
            },
            json: true });
        })
        .then(res => {
          userId = res.id;
          userName = res.name;
          userEmail = res.email;
          return true;
        })
    }
  };
};
