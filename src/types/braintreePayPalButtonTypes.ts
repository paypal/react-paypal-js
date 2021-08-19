import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import {
    CreateOrderActions,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import type { BraintreeClient } from "./braintree/clientTypes";
import type { BraintreePayPalCheckout } from "./braintree/paypalCheckout";

export type CreateBraintreeActions = CreateOrderActions & {
    braintree: BraintreePayPalCheckout;
};

export type OnApproveBraintreeActions = OnApproveActions & {
    braintree: BraintreePayPalCheckout;
};

export type OnApproveData = {
    billingToken?: string | null;
    facilitatorAccessToken: string;
    orderId: string;
    payerId?: string | null;
    paymentId?: string | null;
    subscriptionId?: string | null;
    authCode?: string | null;
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
    client: BraintreeClient;
    paypalCheckout: BraintreePayPalCheckout;
};
