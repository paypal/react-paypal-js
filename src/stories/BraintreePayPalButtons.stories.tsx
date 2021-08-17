import React, { useState, useEffect, ReactElement } from "react";
import type { FC } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import { PayPalScriptProvider } from "../index";
import { BraintreePayPalButtons } from "../components/braintree/BraintreePayPalButtons";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
} from "./utils";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

export default {
    title: "Example/BraintreePayPalButtons",
    component: BraintreePayPalButtons,
    parameters: { parameters: { react: { async: true } } },
    argTypes: {
        style: { control: null },
    },
    args: {
        // Storybook passes empty functions by default for props like `onShippingChange`.
        // This turns on the `onShippingChange()` feature which uses the popup experience with the Standard Card button.
        // We pass null to opt-out so the inline guest feature works as expected with the Standard Card button.
        onShippingChange: null,
    },
    decorators: [
        (Story: FC): ReactElement => {
            // Work around to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken());
                })();
            }, []);

            return (
                <div style={{ minHeight: "200px" }}>
                    {clientToken != null && (
                        <PayPalScriptProvider
                            options={{
                                ...scriptProviderOptions,
                                "data-client-token": clientToken,
                                "data-namespace": generateRandomString(),
                            }}
                        >
                            <Story />
                        </PayPalScriptProvider>
                    )}
                </div>
            );
        },
    ],
};

export const Default: FC = () => <BraintreePayPalButtons />;
