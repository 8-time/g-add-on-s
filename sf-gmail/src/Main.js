var DEBUG = true;

function handleHomePage(event) {
  event.parameters = { action: 'showHomePage' };
  return dispatchActionInternal_(event, addOnErrorHandler);
}

function dispatchActionInternal_(event, errorHandler) {
  if (DEBUG) {
    console.time('dispatchActionInternal');
    console.log(event);
  }

  try {
    var actionName = event.parameters.action;
    if (!actionName) {
      throw new Error('Missing action name.');
    }

    var actionFn = ActionHandlers[actionName];
    if (!actionFn) {
      throw new Error('Action not found: ' + actionName);
    }

    return actionFn(event);
  } catch (err) {
    console.error(err);
    if (errorHandler) {
      return errorHandler(err);
    } else {
      throw err;
    }
  } finally {
    if (DEBUG) {
      console.timeEnd('dispatchActionInternal');
    }
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function handleSalesforceOAuthResponse(oauthResponse) {
  if (DEBUG) {
    console.time('handleSalesforceOAuthResponse');
  }

  try {
    salesforceClient().handleOAuthResponse(oauthResponse);
    return HtmlService.createTemplateFromFile('html/auth-success').evaluate();
  } catch (e) {
    var template = HtmlService.createTemplateFromFile('html/auth-failure');
    template.errorMessage = e.toString();
    return template.evaluate();
  } finally {
    if (DEBUG) {
      console.timeEnd('handleSalesforceOAuthResponse');
    }
  }
}

function handleClearSession() {
  return dispatchActionInternal_(
    {
      parameters: {
        action: 'disconnectAccount',
      },
    },
    universalActionErrorHandler
  );
}

function handleAuthorizationRequired() {
  return dispatchActionInternal_({
    parameters: {
      action: 'showAuthorizationCard',
    },
  });
}

function addOnErrorHandler(err) {
  if (err instanceof AuthorizationRequiredException) {
    CardService.newAuthorizationException()
      .setAuthorizationUrl(salesforceClient().authorizationUrl())
      .setResourceDisplayName('Salesforce')
      .setCustomUiCallback('handleAuthorizationRequired')
      .throwException();
  } else {
    return buildErrorCard({
      exception: err,
      showStackTrace: DEBUG,
    });
  }
}

function universalActionErrorHandler(err) {
  var card = addOnErrorHandler(err);
  return CardService.newUniversalActionResponseBuilder()
    .displayAddOnCards([card])
    .build();
}
