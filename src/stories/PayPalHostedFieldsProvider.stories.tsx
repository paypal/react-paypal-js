import React, { useState, useEffect } from "react";
import type { FC, ReactElement } from "react";
import { action } from "@storybook/addon-actions";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import {
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    PAYPAL_HOSTED_FIELDS_TYPES,
    usePayPalHostedFields,
} from "../index";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
    HEROKU_SERVER,
} from "./utils";

const uid = generateRandomString();
const TOKEN_URL = `${HEROKU_SERVER}/api/paypal/hosted-fields/auth`;
const scriptProviderOptions: PayPalScriptOptions = {
    "client-id":
        "AdOu-W3GPkrfuTbJNuW9dWVijxvhaXHFIRuKrLDwu14UDwTTHWMFkUwuu9D8I1MAQluERl9cFOd7Mfqe",
    components: "buttons,hosted-fields",
    ...getOptionsFromQueryString(),
};

// Component to show the client isn't eligible to use hosted fields
const NotEligibleError = () => (
    <h3>Your client is not able to use hosted fields</h3>
);

const LoadedCardFields = () => {
    const cardFields = usePayPalHostedFields();

    useEffect(() => {
        if (cardFields) {
            action("loaded")("Hosted fields provider successfully loaded.");
        }
    }, [cardFields]);

    return (
        <>
            <p>
                <b>Hosted fields loaded: </b>
                {cardFields ? (
                    <span style={{ fontSize: "20px" }}>&#9989;</span>
                ) : (
                    <span style={{ fontSize: "20px" }}>&#10060;</span>
                )}
            </p>
        </>
    );
};

export default {
    title: "PayPal/PayPalHostedFieldsProvider",
    component: PayPalHostedFieldsProvider,
    parameters: {
        controls: { expanded: true },
        docs: { source: { type: "code" } },
    },
    argTypes: {
        styles: {
            control: { type: "object", expanded: true },
        },
        createOrder: {
            control: false,
        },
        notEligibleError: {
            control: false,
        },
    },
    args: {
        styles: {
            ".valid": { color: "#28a745" },
            ".invalid": { color: "#dc3545" },
        },
    },
    decorators: [
        (Story: FC): ReactElement => {
            // Workaround to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken(TOKEN_URL));
                })();
            }, []);

            return (
                <div style={{ minHeight: "200px" }}>
                    {clientToken && (
                        <>
                            <PayPalScriptProvider
                                options={{
                                    ...scriptProviderOptions,
                                    "data-client-token": clientToken,
                                    "data-namespace": uid,
                                    "data-uid": uid,
                                    debug: true,
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

export const Default: FC<{ styles: { [key in string]: unknown } }> = (args) => {
    return (
        <PayPalHostedFieldsProvider
            createOrder={() => {
                // Server call to create the order
                return Promise.resolve("7NE43326GP4951156");
            }}
            notEligibleError={<NotEligibleError />}
            styles={args.styles}
        >
            <LoadedCardFields />
            <PayPalHostedField
                id="card-number"
                className="card-field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <PayPalHostedField
                id="cvv"
                className="card-field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                options={{
                    selector: "#cvv",
                    placeholder: "123",
                    maskInput: {
                        character: "#",
                    },
                }}
            />
            <PayPalHostedField
                id="expiration-date"
                className="card-field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                options={{
                    selector: "#expiration-date",
                    placeholder: "MM/YYYY",
                }}
            />
        </PayPalHostedFieldsProvider>
    );
};
