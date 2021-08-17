import React, { FC, useEffect } from "react";
import { loadCustomScript } from "@paypal/paypal-js";

import {
    DATA_CLIENT_TOKEN,
    BRAINTREE_SOURCE,
    BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
} from "../../constants";
import type { BraintreePayPalButtonsComponentProps } from "../../types/braintreePayPalButtonTypes";
import { PayPalButtons } from "../PayPalButtons";
import { useBraintreeProviderContext } from "../../hooks/braintreeProviderHooks";
import { getBraintreeWindowNamespace } from "../../utils";
import { DISPATCH_ACTION } from "../../types/enums";
import { decorateActions } from "./utils";

/**
 * React functional component to create a PayPal button using the Braintree.
 * This component is a wrapper of the PayPalButtons and override the logic
 * of the createOrder and onApprove callback function from the SDK.
 *
 * @param param0 the props of the component
 * @returns an JSX code to translate to the DOM
 */
export const BraintreePayPalButtons: FC<BraintreePayPalButtonsComponentProps> =
    ({
        className = "",
        disabled = false,
        children = null,
        forceReRender = [],
        ...buttonProps
    }: BraintreePayPalButtonsComponentProps) => {
        const [providerContext, dispatch] = useBraintreeProviderContext();

        useEffect(() => {
            Promise.all([
                loadCustomScript({ url: BRAINTREE_SOURCE }),
                loadCustomScript({ url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE }),
            ]).then(async () => {
                const clientToken = providerContext?.options[
                    DATA_CLIENT_TOKEN
                ] as string;

                const braintreeNamespace = getBraintreeWindowNamespace();
                const clientInstance = await braintreeNamespace.client.create({
                    authorization: clientToken,
                });
                dispatch({
                    type: DISPATCH_ACTION.SET_BRAINTREE_INSTANCE,
                    value: await braintreeNamespace.paypalCheckout.create({
                        client: clientInstance,
                    }),
                });
            });
        }, [providerContext?.options, dispatch]);

        return (
            <>
                {providerContext.braintreePayPalCheckoutInstance && (
                    <PayPalButtons
                        className={className}
                        disabled={disabled}
                        forceReRender={forceReRender}
                        {...decorateActions(
                            buttonProps,
                            providerContext.braintreePayPalCheckoutInstance
                        )}
                    >
                        {children}
                    </PayPalButtons>
                )}
            </>
        );
    };
