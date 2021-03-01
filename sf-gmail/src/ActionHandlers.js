var ActionHandlers = {
  showHomePage: function () {
    var userResponse = salesforceClient().query(Queries.CHATTER_USERS);

    return [
      buildHomeCard({
        users: userResponse.users,
      }),
    ];
  },

  showAuthorizationCard: function () {
    return buildAuthorizationCard({
      url: salesforceClient().authorizationUrl(),
    });
  },

  disconnectAccount: function () {
    salesforceClient().reset();
    var authCard = buildAuthorizationCard({
      url: salesforceClient().authorizationUrl(),
    });
    var navigation = CardService.newNavigation()
      .popToRoot()
      .updateCard(authCard);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigation)
      .setStateChanged(true)
      .build();
  },
};
