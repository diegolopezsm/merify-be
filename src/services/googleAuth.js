const { google } = require("googleapis");
const config = require("../config");

class GoogleAuthService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
  }

  generateAuthUrl(state) {
    return this.oauth2Client.generateAuthUrl({
      access_type: "online",
      prompt: "consent",
      state: state,
      include_granted_scopes: true,
      scope: config.google.scopes,
    });
  }

  async getToken(code) {
    return await this.oauth2Client.getToken(code);
  }
}

module.exports = GoogleAuthService;
