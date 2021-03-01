function buildHomeCard(opts) {
  var usersSection = CardService.newCardSection().setHeader(
    'Home Page Title / Users'
  );

  if (opts.users.length == 0) {
    var message = CardService.newTextParagraph().setText('You have no users.');
    usersSection.addWidget(message);
  }

  opts.users.forEach(function (user) {
    var widget = CardService.newKeyValue().setContent(user.displayName);
    usersSection.addWidget(widget);
  });

  var card = CardService.newCardBuilder().addSection(usersSection);
  return card.build();
}

function buildErrorCard(opts) {
  var errorText = opts.errorText;

  if (opts.exception && !errorText) {
    errorText = opts.exception.toString();
  }

  if (!errorText) {
    errorText = 'No additional information is available.';
  }

  var card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader().setTitle('An unexpected error occurred')
  );
  card.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(errorText)
    )
  );

  if (opts.showStackTrace && opts.exception && opts.exception.stack) {
    var stack = opts.exception.stack.replace(/\n/g, '<br/>');
    card.addSection(
      CardService.newCardSection()
        .setHeader('Stack trace')
        .addWidget(CardService.newTextParagraph().setText(stack))
    );
  }

  return card.build();
}

function buildAuthorizationCard(opts) {
  var header = CardService.newCardHeader().setTitle('Authorization required');
  var section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph().setText(
        'Please authorize access to your Salesforce account.'
      )
    )
    .addWidget(
      CardService.newButtonSet().addButton(
        CardService.newTextButton()
          .setText('Authorize')
          .setAuthorizationAction(
            CardService.newAuthorizationAction().setAuthorizationUrl(opts.url)
          )
      )
    );
  var card = CardService.newCardBuilder().setHeader(header).addSection(section);
  return card.build();
}
