import type { AuthorizationResponse } from "paypal-checkout-components";

import type { Client, PayPalCheckout } from "braintree-web";
import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";

export interface BraintreePayPalButtonsComponentProps
    extends Omit<PayPalButtonsComponentProps, "createOrder" | "onApprove"> {
    /**
     * Override the default createOrder function from paypal-js library
     */
    createOrder?: (paypalCheckoutInstance: PayPalCheckout) => Promise<string>;
    /**
     * Override the default onApprove function from paypal-js library
     */
    onApprove?: (payload: AuthorizationResponse) => Promise<void>;
}

export type BraintreeNamespace = {
    client: Client;
    paypalCheckout: PayPalCheckout;
};
