import React, { useState, useEffect, ReactElement } from "react";
import type { FC } from "react";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import {
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    PAYPAL_HOSTED_FIELDS_TYPES,
} from "../index";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
} from "./utils";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "hosted-fields",
    ...getOptionsFromQueryString(),
};

export default {
    title: "Example/PayPalHostedFields",
    component: PayPalHostedFieldsProvider,
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
            // Workaround to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);
            const uid = generateRandomString();

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken());
                })();
            }, []);

            return (
                <div style={{ minHeight: "200px" }}>
                    {clientToken != null && (
                        <>
                            <PayPalScriptProvider
                                options={{
                                    ...scriptProviderOptions,
                                    "data-client-token": clientToken,
                                    "data-namespace": uid,
                                    "data-uid": uid,
                                }}
                            >
                                <Story />
                            </PayPalScriptProvider>
                        </>
                    )}
                </div>
            );
        },
    ],
};

export const Default: FC = () => {
    return (
        <PayPalHostedFieldsProvider
            createOrder={() => {
                return Promise.resolve("76536453");
            }}
        >
            <PayPalHostedField
                id="card-number"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{ selector: "#card-number" }}
            />
            <PayPalHostedField
                id="cvv"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                options={{ selector: "#cvv" }}
            />
            <PayPalHostedField
                id="expiration-date"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                options={{ selector: "#expiration-date" }}
            />
        </PayPalHostedFieldsProvider>
    );
};
