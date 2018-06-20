import PropTypes from 'prop-types';
import React from 'react';


export interface IGenericObject { [key:string]: any; }

export interface IProps {
  buttonProps?: IGenericObject;

  children?: React.ReactNode;

  scriptUrl?: string;
  onScriptLoad?: () => void;
  onScriptError?: () => void;

  plaidLinkProps: {
    clientName: string;
    product: Array<'auth' | 'transactions' | 'identity' | 'balance' | 'income' | 'assets'>;
    key: string;
    env: 'sandbox' | 'development' | 'production';
    onSuccess: (publicToken:string, metadata:IGenericObject) => void;
    onExit?: (error:IGenericObject, metadata:IGenericObject) => void;
    onEvent?: (eventName:string, metadata:IGenericObject) => void;
    onLoad?: () => void;
    webhook?: string;
    token?: string;
    isWebView?: boolean;
  };
}
export interface IState {
  scriptErrored: boolean;
  scriptLoaded: boolean;
}

class PlaidLinkButton extends React.PureComponent<IProps, IState> {
  plaidLinkHandler: any;

  static propTypes = {
    // Any props set here will be spread onto the top-level button element
    buttonProps: PropTypes.object,

    // Used to set the button text
    children: PropTypes.node,

    scriptUrl: PropTypes.string,
    onScriptLoad: PropTypes.func,
    onScriptError: PropTypes.func,

    // See: https://plaid.com/docs/api/#integrating-with-link
    plaidLinkProps: PropTypes.shape({
      // Displayed once a user has successfully linked their account
      clientName: PropTypes.string.isRequired,

      // A list of Plaid product(s) you wish to use. Valid products are : transactions, auth, and identity.
      // Only institutions that support all requested products will be shown.
      product: PropTypes.arrayOf(PropTypes.oneOf(['auth', 'transactions', 'identity', 'balance', 'income', 'assets'])).isRequired,

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
  };

  static defaultProps = {
    scriptUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
    children: 'Link new account',
  };

  constructor(props:IProps) {
    super(props);
    this.state = {
      scriptErrored: false,
      scriptLoaded: false,
    };
  }

  handleButtonClick = () => {
    this.plaidLinkHandler.open();
  }

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
    this.plaidLinkHandler = (window as any).Plaid.create({ ...this.props.plaidLinkProps });
    if (this.props.onScriptLoad) this.props.onScriptLoad();
  }

  handleScriptError = () => {
    this.setState({ scriptErrored: true });
    if (this.props.onScriptError) this.props.onScriptError();
  }

  getScriptEl = () : HTMLScriptElement => {
    return document.querySelector(`script[src="${this.props.scriptUrl}"]`);
  }

  componentDidMount() {
    let scriptEl = this.getScriptEl();

    const scriptAlreadyInserted = scriptEl != null;
    const scriptAlreadyLoaded = scriptAlreadyInserted && (window as any).Plaid;
    if (scriptAlreadyLoaded) {
      this.handleScriptLoad();
      return;
    }
    if (scriptAlreadyInserted) {
      scriptEl.addEventListener('load', this.handleScriptLoad);
      return;
    }

    scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.src = this.props.scriptUrl;
    scriptEl.addEventListener('load', this.handleScriptLoad);
    scriptEl.addEventListener('error', this.handleScriptError);
    document.head.appendChild(scriptEl);
  }

  componentWillUnmount() {
    const scriptEl = this.getScriptEl();
    if (scriptEl) {
      scriptEl.removeEventListener('load', this.handleScriptLoad);
      scriptEl.removeEventListener('error', this.handleScriptError);
    }
  }

  render() {
    return (
      <button
        {...this.props.buttonProps}
        disabled={this.state.scriptErrored || !this.state.scriptLoaded}
        onClick={this.handleButtonClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export default PlaidLinkButton;
