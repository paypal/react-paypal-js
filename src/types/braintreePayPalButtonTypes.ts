import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";

export type CreateBraintreeActions = CreateOrderActions & {
    braintree: unknown;
};

export type OnApproveBraintreeActions = OnApproveActions & {
    braintree: unknown;
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
    client: {
        create: (options: { authorization: string }) => Promise<unknown>;
    };
    paypalCheckout: {
        create: (options: { client: unknown }) => Promise<unknown>;
    };
};
