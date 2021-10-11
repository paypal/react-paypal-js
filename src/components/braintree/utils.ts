import type { BraintreePayPalCheckout } from "../../types/braintree/paypalCheckout";
import type {
    PayPalButtonsComponentProps,
    BraintreePayPalButtonsComponentProps,
} from "../../types";

/**
 * Override the callbacks to send the data and Braintree instance as argument
 * to the defined functions from BraintreePayPalButtons component
 *
 * @param functionToDecorate     the name of the function to decorate
 * @param braintreeButtonProps   the BraintreePayPalButtons component declared properties
 * @param payPalCheckoutInstance the Braintree instance to send as argument
 */
const decorateFunction = (
    functionToDecorate: "createOrder" | "createBillingAgreement" | "onApprove",
    braintreeButtonProps: BraintreePayPalButtonsComponentProps,
    payPalCheckoutInstance: BraintreePayPalCheckout
) => {
    const braintreeFunctionReference = braintreeButtonProps[functionToDecorate];

    if (
        braintreeFunctionReference &&
        typeof braintreeButtonProps[functionToDecorate] === "function"
    ) {
        braintreeButtonProps[functionToDecorate] = (data, actions) =>
            braintreeFunctionReference(data, {
                ...actions,
                braintree: payPalCheckoutInstance,
            });
    }
};

/**
 * Use `actions.braintree` to provide an interface for the paypalCheckoutInstance
 * through the createOrder and onApprove callbacks
 *
 * @param braintreeButtonProps the component button options
 * @returns a new copy of the component button options casted as {@link PayPalButtonsComponentProps}
 */
export const decorateActions = (
    buttonProps: BraintreePayPalButtonsComponentProps,
    payPalCheckoutInstance: BraintreePayPalCheckout
): PayPalButtonsComponentProps => {
    decorateFunction("createOrder", buttonProps, payPalCheckoutInstance);
    decorateFunction(
        "createBillingAgreement",
        buttonProps,
        payPalCheckoutInstance
    );
    decorateFunction("onApprove", buttonProps, payPalCheckoutInstance);

    return { ...buttonProps } as PayPalButtonsComponentProps;
};
