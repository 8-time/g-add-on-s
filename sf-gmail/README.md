# Sample add-on: Google Gmail Salesforce

## Before you begin

1.  Initialize the project:

        cd sf-gmail/ && npm install

## Deploy the add-on

Deploy the add-on by following these steps:

1.  Authorize clasp to manage your scripts

        npx @google/clasp login

2.  Create a new project:

        npx @google/clasp create --type standalone --title "Google Gmail Salesforce"

3.  Push the code:

        npx @google/clasp push -f

## Configure Salesforce credentials

Access the Salesforce API requires registration. To register your own application:

1.  Open the script editor:

        npx @google/clasp open

2.  Get the script id by clicking on **File > Project properties** and note the value of the **Script ID** field.

3.  Follow [Salesforce's guide][sf] to create an OAuth Application. Use the value `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback` for the **Authorization callback URL**,
    replacing `{SCRIPT_ID}` with the script id located in the previous step.

4.  Create a script property with the credentials:

    a. Click on **File > Project properties > Script properties**.

    b. Click **Add row**.

    c. Enter the property name `salesforceCredentials`.

    d. Click on the blank area in the **Value** column.

    e. Enter the value below, subsituting the `{CLIENT_ID}` and `{CLIENT_SECRET}` with the values provided
    by GitHub.

        {"clientId": "{CLIENT_ID}", "clientSecret": "{CLIENT_SECRET}"}

    f. Click **Save**.

## Install the add-on

Once the add-on is deployed, install the add-on on your account using these steps:

1.  Open the project

        npx @google/clasp open

2.  In the Apps Script editor, select **Publish > Deploy from manifest...** to open the _Deployments_ dialog.

3.  In the **Latest Version (Head)** row, click **Install add-on** to install the currently saved version of the add-on in development-mode.

## Run the add-on

1.  Open [Gmail][gmail]. If Gmail was open prior to enabling the add-on,
    you may need to refresh the tab.

2.  The add-on should place a contextual card on the right-side of the window,
    with a message asking for authorization. Click the **Authorize access** link
    to open a dialog where you can authorize the add-on.

3.  Select the account that should authorize the add-on.

4.  Read the notice in the next dialog carefully, then click **Allow**.

5.  Once authorized, the add-on should automatically refresh and start operating.

<!-- References -->

[sf]: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_oauth_and_connected_apps.htm
