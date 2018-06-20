/// <reference types="react" />
import PropTypes from 'prop-types';
import React from 'react';
export interface IGenericObject {
    [key: string]: any;
}
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
        onSuccess: (publicToken: string, metadata: IGenericObject) => void;
        onExit?: (error: IGenericObject, metadata: IGenericObject) => void;
        onEvent?: (eventName: string, metadata: IGenericObject) => void;
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
declare class PlaidLinkButton extends React.PureComponent<IProps, IState> {
    plaidLinkHandler: any;
    static propTypes: {
        buttonProps: PropTypes.Requireable<any>;
        children: PropTypes.Requireable<any>;
        scriptUrl: PropTypes.Requireable<any>;
        onScriptLoad: PropTypes.Requireable<any>;
        onScriptError: PropTypes.Requireable<any>;
        plaidLinkProps: PropTypes.Validator<any>;
    };
    static defaultProps: {
        scriptUrl: string;
        children: string;
    };
    constructor(props: IProps);
    handleButtonClick: () => void;
    handleScriptLoad: () => void;
    handleScriptError: () => void;
    getScriptEl: () => HTMLScriptElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default PlaidLinkButton;
