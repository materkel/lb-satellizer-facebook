/* jshint -W097  */
/* globals require, module, console */

var request = require('request-promise');
var qs = require('querystring');

module.exports = Facebook;

function Facebook (config) {
  this.authType = 'oauth2';
  this.clientSecret = config.secret;
  this.userId = null;
  this.userName = null;
  this.userEmail = null;
  this.accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
  this.graphApiUrl = 'https://graph.facebook.com/me';
}

Facebook.prototype.authenticate = function(req) {
  var self = this;
  var authData = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: this.clientSecret,
    redirect_uri: req.body.redirectUri
  };

  return request({ url: self.accessTokenUrl, qs: authData, json: true })
    .then(function(response) {
      response = qs.parse(response);
      return response.access_token;
    })
    .then(function(accessToken) {
      return self.retrieveProfile(accessToken);
    });
};

Facebook.prototype.retrieveProfile = function(accessToken) {
  var self = this;
  return request({ url: self.graphApiUrl, qs: { access_token: accessToken }, json: true})
    .then(function(response) {
      self.userId = response.id;
      self.userName = response.name;
      self.userEmail = response.email;
      return true;
    });
};
