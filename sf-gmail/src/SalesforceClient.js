function AuthorizationRequiredException() {}

function salesforceClient() {
  var credentials = getSalesforceCredentials();
  if (!credentials) {
    throw new Error(
      'No credentials found. Set the script property `salesforceCredentials`'
    );
  }
  var oauthService = OAuth2.createService('Saleforce')
    .setAuthorizationBaseUrl(
      'https://login.salesforce.com/services/oauth2/authorize'
    )
    .setTokenUrl('https://login.salesforce.com/services/oauth2/token')
    .setClientId(credentials.clientId)
    .setClientSecret(credentials.clientSecret)
    .setCallbackFunction('handleSalesforceOAuthResponse')

    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setScope('chatter_api refresh_token');

  return Object.assign(Object.create(salesforceClientPrototype), {
    oauthService: oauthService,
    credentials: credentials,
  });
}

function withRetry(service, func) {
  var response;
  var content;
  try {
    response = func();
    content = response.getContentText();
  } catch (e) {
    content = e.toString();
  }
  if (content.indexOf('INVALID_SESSION_ID') !== -1) {
    service.refresh();
    return func();
  }

  if (!response) {
    throw new Error(content);
  }

  return response;
}

var salesforceClientPrototype = {
  oauthService: null,

  authorizationUrl: function () {
    return this.oauthService.getAuthorizationUrl();
  },

  handleOAuthResponse: function (oauthResponse) {
    var authorized = this.oauthService.handleCallback(oauthResponse);
    if (!authorized) {
      throw new Error('Authorization declined.');
    }
  },

  query: function (query) {
    var service = this.oauthService;

    if (DEBUG) {
      console.time('query');
    }

    try {
      if (!service.hasAccess()) {
        throw new AuthorizationRequiredException();
      }

      var response = withRetry(service, function () {
        return UrlFetchApp.fetch(
          Utilities.formatString(
            '%s%s%s',
            service.getToken().instance_url,
            '/services/data/v51.0',
            query
          ),
          {
            headers: {
              Authorization: Utilities.formatString(
                'Bearer %s',
                service.getAccessToken()
              ),
            },
          }
        );
      });

      var rawResponse = response.getContentText();
      var parsedResponse = JSON.parse(rawResponse);

      if (DEBUG) {
        console.log(parsedResponse);
      }

      if (parsedResponse.message == 'Bad credentials') {
        throw new AuthorizationRequiredException();
      }

      return parsedResponse;
    } finally {
      if (DEBUG) {
        console.timeEnd('query');
      }
    }
  },

  reset: function () {
    if (!this.oauthService.hasAccess()) {
      return;
    }

    if (DEBUG) {
      console.log('Reset the authorization state');
    }

    this.oauthService.reset();
  },
};
