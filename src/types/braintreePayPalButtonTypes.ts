import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import type { Client } from "./braintree/clientTypes";
import type { PayPalCheckout } from "./braintree/paypalCheckout";

export type CreateBraintreeActions = CreateOrderActions & {
    braintree: PayPalCheckout;
};

export type OnApproveBraintreeActions = OnApproveActions & {
    braintree: PayPalCheckout;
};

export interface BraintreePayPalButtonsComponentProps
    extends Omit<PayPalButtonsComponentProps, "createOrder" | "onApprove"> {
    /**
     * Override the default createOrder function from paypal-js library
     */
    createOrder?: (
        data: Record<string, unknown>,
        actions: CreateBraintreeActions
    ) => Promise<string>;
    /**
     * Override the default onApprove function from paypal-js library
     */
    onApprove?: (
        data: OnApproveData,
        actions: OnApproveBraintreeActions
    ) => Promise<void>;
}

export type BraintreeNamespace = {
    client: Client;
    paypalCheckout: PayPalCheckout;
};
