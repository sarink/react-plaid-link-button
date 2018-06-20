var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import PropTypes from 'prop-types';
import React from 'react';
var PlaidLinkButton = /** @class */ (function (_super) {
    __extends(PlaidLinkButton, _super);
    function PlaidLinkButton(props) {
        var _this = _super.call(this, props) || this;
        _this.handleButtonClick = function () {
            _this.plaidLinkHandler.open();
        };
        _this.handleScriptLoad = function () {
            _this.setState({ scriptLoaded: true });
            _this.plaidLinkHandler = window.Plaid.create(__assign({}, _this.props.plaidLinkProps));
            if (_this.props.onScriptLoad)
                _this.props.onScriptLoad();
        };
        _this.handleScriptError = function () {
            _this.setState({ scriptErrored: true });
            if (_this.props.onScriptError)
                _this.props.onScriptError();
        };
        _this.getScriptEl = function () {
            return document.querySelector("script[src=\"" + _this.props.scriptUrl + "\"]");
        };
        _this.state = {
            scriptErrored: false,
            scriptLoaded: false,
        };
        return _this;
    }
    PlaidLinkButton.prototype.componentDidMount = function () {
        var scriptEl = this.getScriptEl();
        var scriptAlreadyInserted = scriptEl != null;
        var scriptAlreadyLoaded = scriptAlreadyInserted && window.Plaid;
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
    };
    PlaidLinkButton.prototype.componentWillUnmount = function () {
        var scriptEl = this.getScriptEl();
        if (scriptEl) {
            scriptEl.removeEventListener('load', this.handleScriptLoad);
            scriptEl.removeEventListener('error', this.handleScriptError);
        }
    };
    PlaidLinkButton.prototype.render = function () {
        return (React.createElement("button", __assign({}, this.props.buttonProps, { disabled: this.state.scriptErrored || !this.state.scriptLoaded, onClick: this.handleButtonClick }), this.props.children));
    };
    PlaidLinkButton.propTypes = {
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
    PlaidLinkButton.defaultProps = {
        scriptUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
        children: 'Link new account',
    };
    return PlaidLinkButton;
}(React.PureComponent));
export default PlaidLinkButton;
