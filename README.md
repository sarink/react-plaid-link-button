# react-plaid-link-button
A drop-in implementation of [Plaid Link](https://plaid.com/docs/api/#creating-items-with-plaid-link) with typescript definitions,
built for React. Originally written for [Basil Finance](https://basilfinance.com).


## Install
```
npm install react-plaid-link-button --save
```


## Dependencies
None!


## Typescript?
Yup! Check out the [definition file](https://github.com/sarink/react-plaid-link-button/blob/master/dist/react-plaid-link-button/react-plaid-link-button.d.ts)

## Example
```
import PlaidLinkButton from 'react-plaid-link-button';

class PlaidLinkExample extends React.Component {
  render() {
    return (
      <PlaidLinkButton
        buttonProps={{ className: 'some-class' }}
        plaidLinkProps={{
          clientName: PLAID_CLIENT_NAME,
          key: PLAID_PUBLIC_KEY,
          env: PLAID_ENV,
          product: ['transactions'],
          webhook: 'https://my-backend-webhook',
        }}
        onScriptLoad={() => this.setState({ loaded: true })}
      >
        this.state.loaded ? 'Click me to launch Plaid!' : 'Loading....'
      </PlaidLinkButton>
    );
  }
}
```

## Props
```
// Any props set here will be spread onto the top-level button element
buttonProps: PropTypes.object,

// Used to set the button text, defaults to: 'Link new account'
children: PropTypes.node,

// The URL of the plaid-link-script to load, defaults to: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
scriptUrl: PropTypes.string,

// Callback when the script has been loaded successfully
onScriptLoad: PropTypes.func,

// Callback if loading the script has failed
onScriptError: PropTypes.func,

// See: https://plaid.com/docs/api/#integrating-with-link for more
plaidLinkProps: PropTypes.shape({
  // Displayed once a user has successfully linked their account
  clientName: PropTypes.string.isRequired,

  // A list of Plaid product(s) you wish to use. Valid products are : transactions, auth, and identity.
  // Only institutions that support all requested products will be shown.
  product: PropTypes.arrayOf(PropTypes.oneOf(['transactions', 'auth', 'identity'])).isRequired,

  // The public_key associated with your account; available from the Dashboard.
  key: PropTypes.string.isRequired,

  // The Plaid API environment on which to create user accounts.
  // For development and testing, use sandbox or development. For production use, use production.
  // Note: all production requests are billed.
  env: PropTypes.oneOf(['sandbox', 'development', 'production']).isRequired,

  // A function that is called when a user has successfully onboarded an Item.
  // The function should expect two arguments, the public_token and a metadata object.
  onSuccess: PropTypes.func.isRequired,

  // A function that is called when a user has specifically exited the Link flow.
  // The function should expect two arguments, a nullable error object and a metadata object.
  onExit: PropTypes.func,

  // A function that is called when a user reaches certain points in the Link flow.
  // The function should expect two arguments, an eventName string and a metadata object. See onEvent.
  onEvent: PropTypes.func,

  // A function that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be delayed until the module is fully loaded.
  onLoad: PropTypes.func,

  // Specify a webhook to associate with an Item.
  // Plaid fires a webhook when the Item requires updated credentials or when new data is available.
  webhook: PropTypes.string,

  // Specify a public_token to launch Link in update mode for a particular Item.
  // This will cause Link to open directly to the authentication step for that Item's institution.
  // Use the POST /item/public_token/create endpoint to generate a public_token for an Item.
  token: PropTypes.string,

  // Set to true if launching Link within a WebView.
  isWebView: PropTypes.bool,
}).isRequired,
```

## Contributing/How to build
Shell into the docker container and run the build script

```
docker-compose run --rm frontend bash
npm run build:prod
```




## License
MIT
