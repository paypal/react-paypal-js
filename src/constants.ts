// Common reference to the script identifier
export const SCRIPT_ID = "data-react-paypal-script-id";
export const DATA_CLIENT_TOKEN = "data-client-token";

export const EMPTY_PROVIDER_CONTEXT_ERROR_MESSAGE =
    "usePayPalScriptReducer must be used within a PayPalScriptProvider";
export const EMPTY_PROVIDER_CONTEXT_CLIENT_TOKEN_ERROR_MESSAGE =
    "A client token wasn't found in the provider parent component";

export const BRAINTREE_CLIENT_SCRIPT_ID = "braintree-client-script";
export const BRAINTREE_PAYPAL_CHECKOUT_SCRIPT_ID =
    "braintree-paypal-checkout-script";

const braintreeVersion = "3.79.1";
export const BRAINTREE_SOURCE = `https://js.braintreegateway.com/web/${braintreeVersion}/js/client.min.js`;
export const BRAINTREE_PAYPAL_CHECKOUT_SOURCE = `https://js.braintreegateway.com/web/${braintreeVersion}/js/paypal-checkout.min.js`;
