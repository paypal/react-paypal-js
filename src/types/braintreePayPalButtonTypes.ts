import type { Client, PayPalCheckout } from "braintree-web";
import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import { UnknownObject } from "@paypal/paypal-js/types/apis/subscriptions";
import {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";

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
        data: UnknownObject,
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
