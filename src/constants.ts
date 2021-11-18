/*********************************************
 * Common reference to the script identifier *
 *********************************************/
export const SCRIPT_ID = "data-react-paypal-script-id";
export const DATA_CLIENT_TOKEN = "data-client-token";
export const DATA_SDK_INTEGRATION_SOURCE = "data-sdk-integration-source";
export const DATA_SDK_INTEGRATION_SOURCE_VALUE = "react-paypal-js";
export const DATA_NAMESPACE = "data-namespace";
export const ERROR_LOADING_SDK = "The SDK can't be loaded due: ";

/****************************
 * Braintree error messages *
 ****************************/
export const EMPTY_PROVIDER_CONTEXT_CLIENT_TOKEN_ERROR_MESSAGE =
    "A client token wasn't found in the provider parent component";

const braintreeVersion = "3.81.0";
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
