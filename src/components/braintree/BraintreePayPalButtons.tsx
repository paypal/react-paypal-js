import React, { FC, useState, useEffect } from "react";
import { loadCustomScript } from "@paypal/paypal-js";

import {
    DATA_CLIENT_TOKEN,
    BRAINTREE_SOURCE,
    BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
} from "../../constants";
import { PayPalButtons } from "../PayPalButtons";
import { useBraintreeProviderContext } from "../../hooks/braintreeProviderHooks";
import { getBraintreeWindowNamespace } from "../../utils";
import { decorateActions } from "./utils";
import type { BraintreePayPalButtonsComponentProps } from "../../types";
import { DISPATCH_ACTION } from "../../types";

/**
This `<BraintreePayPalButtons />` component renders the [Braintree PayPal Buttons](https://developer.paypal.com/braintree/docs/guides/paypal/overview) for Braintree Merchants.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.

Use props for customizing your buttons. For example, here's how you would use the `style`, `createOrder`, and `onApprove` options:

```jsx
    import { PayPalScriptProvider, BraintreePayPalButtons } from "@paypal/react-paypal-js";

    <PayPalScriptProvider options={{ "client-id": "test" }}>
        <BraintreePayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {
                // the paypalCheckoutInstance from the braintree sdk integration is added to `actions.braintree`
                return actions.braintree.createPayment({
                    flow: "checkout",
                    amount: "10.0",
                    currency: "USD",
                    intent: "capture"
                })
            }}
            onApprove={(data, actions) => {
                return actions.braintree.tokenizePayment(data)
                    .then((payload) => {
                        // call server-side endpoint to finish the sale
                    })
            }
        />;
    </PayPalScriptProvider>
```

*/
export const BraintreePayPalButtons: FC<BraintreePayPalButtonsComponentProps> =
    ({
        className = "",
        disabled = false,
        children = null,
        forceReRender = [],
        ...buttonProps
    }: BraintreePayPalButtonsComponentProps) => {
        const [, setErrorState] = useState(null);
        const [providerContext, dispatch] = useBraintreeProviderContext();

        useEffect(() => {
            Promise.all([
                loadCustomScript({ url: BRAINTREE_SOURCE }).catch((err) => {
                    setErrorState(() => {
                        throw new Error(
                            `Failed loading the Braintree Gateway. ${err}`
                        );
                    });
                }),
                loadCustomScript({
                    url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
                }).catch((err) => {
                    setErrorState(() => {
                        throw new Error(
                            `Failed loading the Braintree Gateway PayPalCheckout. ${err}`
                        );
                    });
                }),
            ])
                .then(() => {
                    const clientToken = providerContext.options[
                        DATA_CLIENT_TOKEN
                    ] as string;

                    const braintreeNamespace = getBraintreeWindowNamespace();
                    braintreeNamespace.client
                        .create({
                            authorization: clientToken,
                        })
                        .then((clientInstance) => {
                            return braintreeNamespace.paypalCheckout.create({
                                client: clientInstance,
                            });
                        })
                        .then((paypalCheckoutInstance) => {
                            dispatch({
                                type: DISPATCH_ACTION.SET_BRAINTREE_INSTANCE,
                                value: paypalCheckoutInstance,
                            });
                        })
                        .catch((err) => {
                            setErrorState(() => {
                                throw new Error(
                                    `Failed creating the Braintree Client. ${err}`
                                );
                            });
                        });
                })
                .catch((err) => {
                    setErrorState(() => {
                        throw new Error(
                            `Unknown error occurs creating the Braintree client instance. ${err}`
                        );
                    });
                });
        }, [providerContext.options, dispatch]);

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
