import React, { FC, useState, useEffect } from "react";
import { loadCustomScript } from "@paypal/paypal-js";

import {
    DATA_CLIENT_TOKEN,
    BRAINTREE_SOURCE,
    BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
    BRAINTREE_CLIENT_SCRIPT_ID,
    BRAINTREE_PAYPAL_CHECKOUT_SCRIPT_ID,
    DEFAULT_BRAINTREE_NAMESPACE,
} from "../constants";
import type { PayPalButtonsComponentProps } from "../types/paypalButtonTypes";
import type {
    BraintreePayPalButtonsComponentProps,
    BraintreeNamespace,
} from "../types/braintreePayPalButtonTypes";
import type { PayPalCheckout } from "braintree-web";
import type { PayPalCheckoutTokenizationOptions } from "braintree-web/modules/paypal-checkout";
import { PayPalButtons } from "./PayPalButtons";
import { useBraintreeProviderContext } from "../hooks/braintreeProviderHooks";
import { getNamespace } from "../utils";

/**
 * React functional component to create a PayPal button using the Braintree
 * This component is a wrapper of the PayPalButtons and override the logic
 * of the createOrder and onApprove callback function from the SDK
 *
 * @param param0 the props of the component
 * @returns an JSX code to translate to the DOM
 */
export const BraintreePayPalButton: FC<BraintreePayPalButtonsComponentProps> =
    ({
        className = "",
        disabled = false,
        children = null,
        forceReRender = [],
        ...buttonProps
    }: BraintreePayPalButtonsComponentProps) => {
        const [payPalCheckoutInstance, setPayPalCheckoutInstance] =
            useState<PayPalCheckout | null>(null);
        const providerContext = useBraintreeProviderContext();

        useEffect(() => {
            Promise.all([
                loadCustomScript({
                    url: BRAINTREE_SOURCE,
                    attributes: { id: BRAINTREE_CLIENT_SCRIPT_ID },
                }),
                loadCustomScript({
                    url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
                    attributes: { id: BRAINTREE_PAYPAL_CHECKOUT_SCRIPT_ID },
                }),
            ]).then(async () => {
                const clientToken = providerContext?.options[
                    DATA_CLIENT_TOKEN
                ] as string;

                const braintreeNamespace = getNamespace<BraintreeNamespace>(
                    DEFAULT_BRAINTREE_NAMESPACE
                );
                const clientInstance = await braintreeNamespace.client.create({
                    authorization: clientToken,
                });

                setPayPalCheckoutInstance(
                    await braintreeNamespace.paypalCheckout.create({
                        client: clientInstance,
                    })
                );
            });
        }, [providerContext?.options]);

        /**
         * Override the createOrder callback to send the PayPal checkout instance as argument
         * to the defined createOrder function for braintree component button
         *
         * @param braintreeButtonProps the component button options
         */
        const overrideCreateOrder = (
            braintreeButtonProps: BraintreePayPalButtonsComponentProps
        ) => {
            if (
                braintreeButtonProps.createOrder != undefined &&
                payPalCheckoutInstance != undefined
            ) {
                // Keep the createOrder function reference
                const functionReference = braintreeButtonProps.createOrder;

                braintreeButtonProps.createOrder = () =>
                    functionReference(payPalCheckoutInstance);
            }
        };

        /**
         * Override the onApprove callback to send the payload as argument
         * to the defined onApprove function for braintree component button
         *
         * @param braintreeButtonProps the component button options
         */
        const overrideOnApprove = (
            braintreeButtonProps: BraintreePayPalButtonsComponentProps
        ) => {
            if (
                braintreeButtonProps.onApprove != undefined &&
                payPalCheckoutInstance != undefined
            ) {
                // Store the createOrder function reference
                const braintreeOnApprove = braintreeButtonProps.onApprove;

                braintreeButtonProps.onApprove = async (data: unknown) =>
                    braintreeOnApprove(
                        await payPalCheckoutInstance.tokenizePayment(
                            data as PayPalCheckoutTokenizationOptions
                        )
                    );
            }
        };

        /**
         * Massage needed functions to adapt to PayPal SDK types
         *
         * @param braintreeButtonProps the component button options
         * @returns a new copy of the component button options casted as {@link PayPalButtonsComponentProps}
         */
        const overrideActions = (
            braintreeButtonProps: BraintreePayPalButtonsComponentProps
        ) => {
            overrideCreateOrder(braintreeButtonProps);
            overrideOnApprove(braintreeButtonProps);

            return { ...buttonProps } as PayPalButtonsComponentProps;
        };

        return (
            <>
                {payPalCheckoutInstance && (
                    <PayPalButtons
                        className={className}
                        disabled={disabled}
                        forceReRender={forceReRender}
                        {...overrideActions(buttonProps)}
                    >
                        {children}
                    </PayPalButtons>
                )}
            </>
        );
    };
