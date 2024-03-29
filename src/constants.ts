/*********************************************
 * Common reference to the script identifier *
 *********************************************/

// keep this script id value in kebab-case format
export const SCRIPT_ID = "data-react-paypal-script-id";

export const SDK_SETTINGS = {
    DATA_CLIENT_TOKEN: "dataClientToken",
    DATA_JS_SDK_LIBRARY: "dataJsSdkLibrary",
    DATA_LIBRARY_VALUE: "react-paypal-js",
    DATA_NAMESPACE: "dataNamespace",
    DATA_SDK_INTEGRATION_SOURCE: "dataSdkIntegrationSource",
    DATA_USER_ID_TOKEN: "dataUserIdToken",
};
export const LOAD_SCRIPT_ERROR = "Failed to load the PayPal JS SDK script.";

/****************************
 * Braintree error messages *
 ****************************/
export const EMPTY_BRAINTREE_AUTHORIZATION_ERROR_MESSAGE =
    "Invalid authorization data. Use dataClientToken or dataUserIdToken to authorize.";

const braintreeVersion = "3.84.0";
export const BRAINTREE_SOURCE = `https://js.braintreegateway.com/web/${braintreeVersion}/js/client.min.js`;
export const BRAINTREE_PAYPAL_CHECKOUT_SOURCE = `https://js.braintreegateway.com/web/${braintreeVersion}/js/paypal-checkout.min.js`;

/*********************
 * PayPal namespaces *
 *********************/
export const DEFAULT_PAYPAL_NAMESPACE = "paypal";
export const DEFAULT_BRAINTREE_NAMESPACE = "braintree";

/*****************
 * Hosted Fields *
 *****************/
export const HOSTED_FIELDS_CHILDREN_ERROR =
    "To use HostedFields you must use it with at least 3 children with types: [number, cvv, expirationDate] includes";
export const HOSTED_FIELDS_DUPLICATE_CHILDREN_ERROR =
    "Cannot use duplicate HostedFields as children";

/*******************
 * Script Provider *
 *******************/
export const SCRIPT_PROVIDER_REDUCER_ERROR =
    "usePayPalScriptReducer must be used within a PayPalScriptProvider";
