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
This `<BraintreePayPalButtons />` component renders the Braintree PayPal [Smart Payment Buttons](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/#buttons).
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.

Use props for customizing your buttons. For example, here's how you would use the `style` and `createOrder` options:

```jsx
    import { PayPalScriptProvider, BraintreePayPalButtons } from "@paypal/react-paypal-js";

    <PayPalScriptProvider options={{ "client-id": "test" }}>
        <BraintreePayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {
                return actions.braintree.createPayment({
                    flow: "checkout",
                    amount: "10.0",
                    currency: "USD",
                    intent: "capture",
                    enableShippingAddress: true,
                    shippingAddressEditable: false
                })
            }}
        />;
    </PayPalScriptProvider>
```

Notice the main difference comparing with `<PayPalButtons />` component is the [braintree paypalCheckout](https://developer.paypal.com/braintree/docs/guides/paypal/checkout-with-paypal)
instance in the callbacks (createOrder and onApprove) under actions argument:

```jsx
import { PayPalScriptProvider, BraintreePayPalButtons } from "@paypal/react-paypal-js";

    <PayPalScriptProvider options={{ "client-id": "test" }}>
        <BraintreePayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={(data, actions) => {
                // braintree paypalCheckout instance
                actions.braintree
            }}
            onApprove={(data, actions) => {
                // braintree paypalCheckout instance
                actions.braintree
            }}
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
        const [providerContext, dispatch] = useBraintreeProviderContext();

        useEffect(() => {
            Promise.all([
                loadCustomScript({ url: BRAINTREE_SOURCE }),
                loadCustomScript({ url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE }),
            ]).then(async () => {
                const clientToken = providerContext.options[
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
