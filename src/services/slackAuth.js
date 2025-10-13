const config = require("../config");

class SlackAuthService {
  async exchangeCodeForToken(code) {
    const response = await fetch(`https://slack.com/api/oauth.v2.access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.slack.clientId,
        client_secret: config.slack.clientSecret,
        code: code,
        redirect_uri: config.slack.redirectUri,
      }),
    });
    
    return await response.json();
  }

  generateRedirectUrl(accessToken) {
    return `merify-app://auth?slack_access_token=${accessToken}`;
  }
}

module.exports = SlackAuthService;
