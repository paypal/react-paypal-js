import { PayPalCheckout } from "braintree-web";
import { PayPalButtonsComponentProps } from "./paypalButtonTypes";

export interface BraintreePayPalButtonsComponentProps
    extends Omit<PayPalButtonsComponentProps, "createOrder" | "onApprove"> {
    /**
     * Override the default createOrder function from paypal-js library
     */
    createOrder?: (paypalCheckoutInstance: PayPalCheckout) => Promise<string>;
    /**
     * Override the default onApprove function from paypal-js library
     */
    onApprove?: (payload: unknown) => Promise<void>;
}
