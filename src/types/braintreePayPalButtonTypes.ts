import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import type { BraintreeClient } from "./braintree/clientTypes";
import type {
    BraintreePayPalCheckout,
    BraintreePayPalCheckoutTokenizationOptions,
} from "./braintree/paypalCheckout";

export type BraintreeActions = {
    braintree: BraintreePayPalCheckout;
};

export type OnApproveBraintreeData = BraintreePayPalCheckoutTokenizationOptions;

export interface BraintreePayPalButtonsComponentProps
    extends Omit<
            PayPalButtonsComponentProps,
            "createOrder" | "onApprove" | "createBillingAgreement"
        >,
        Partial<
            Record<
                "createOrder" | "createBillingAgreement" | "onApprove",
                (
                    data: OnApproveBraintreeData | Record<string, unknown>,
                    actions: BraintreeActions
                ) => Promise<string | void>
            >
        > {}

export type BraintreeNamespace = {
    client: BraintreeClient;
    paypalCheckout: BraintreePayPalCheckout;
};
