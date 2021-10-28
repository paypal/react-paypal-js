import React from "react";
import type { Story } from "@storybook/react";

import { Default, BillingAgreement } from "./BraintreePayPalButtons.stories";
import { PayPalScriptProvider, BraintreePayPalButtons } from "../../index";
import { generateDocPageStructure } from "../commons";
import { reactElementToString } from "../utils";

const getDefaultCode = (snippet: Story): string =>
    reactElementToString(
        <div
            style={{ maxWidth: `${snippet?.args?.size}px`, minHeight: "200px" }}
        >
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    components: "buttons",
                    "data-client-token": "your_data_client_token",
                    "data-namespace": "set_unique_identifier_here",
                    "data-uid": "set_unique_identifier_here",
                    intent: "capture",
                    vault: false,
                }}
            >
                <BraintreePayPalButtons
                    style={snippet?.args?.style}
                    disabled={snippet?.args?.disabled}
                    fundingSource={snippet?.args?.fundingSource || false}
                    createOrder={function (data, actions) {
                        return actions.braintree
                            .createPayment({
                                flow: "checkout",
                                amount: "{amount}",
                                currency: "{currency}",
                                intent: "capture",
                                enableShippingAddress: true,
                                shippingAddressEditable: false,
                                shippingAddressOverride: {
                                    recipientName: "Scruff McGruff",
                                    line1: "1234 Main St.",
                                    line2: "Unit 1",
                                    city: "Chicago",
                                    countryCode: "US",
                                    postalCode: "60652",
                                    state: "IL",
                                    phone: "123.456.7890",
                                },
                            })
                            .then((orderId) => {
                                // Your code here after create the order
                                return orderId;
                            });
                    }}
                    onApprove={(data, actions) =>
                        actions.braintree
                            .tokenizePayment(data)
                            .then((payload) => {
                                // Your code here after capture the order
                                alert(JSON.stringify(payload));
                            })
                    }
                />
            </PayPalScriptProvider>
        </div>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

const getBillingAgreementCode = (snippet: Story): string =>
    reactElementToString(
        <div
            style={{ maxWidth: `${snippet?.args?.size}px`, minHeight: "200px" }}
        >
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    components: "buttons",
                    "data-client-token": "your_data_client_token",
                    "data-namespace": "set_unique_identifier_here",
                    "data-uid": "set_unique_identifier_here",
                    intent: "tokenize",
                    vault: true,
                }}
            >
                <BraintreePayPalButtons
                    style={snippet?.args?.style}
                    disabled={snippet?.args?.disabled}
                    fundingSource={snippet?.args?.fundingSource || false}
                    createBillingAgreement={function (data, actions) {
                        return actions.braintree.createPayment({
                            // Required
                            flow: "vault",

                            // The following are optional params
                            billingAgreementDescription:
                                "Your agreement description",
                            enableShippingAddress: true,
                            shippingAddressEditable: false,
                            shippingAddressOverride: {
                                recipientName: "Scruff McGruff",
                                line1: "1234 Main St.",
                                line2: "Unit 1",
                                city: "Chicago",
                                countryCode: "US",
                                postalCode: "60652",
                                state: "IL",
                                phone: "123.456.7890",
                            },
                        });
                    }}
                    onApprove={(data, actions) =>
                        actions.braintree
                            .tokenizePayment(data)
                            .then((payload) => {
                                // Your code here after capture the order
                                alert(JSON.stringify(payload));
                            })
                    }
                />
            </PayPalScriptProvider>
        </div>
    );

const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) =>
                getDefaultCode(snippet),
        },
    };

    (BillingAgreement as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure("Billing Agreement"),
            transformSource: (_: string, snippet: Story) =>
                getBillingAgreementCode(snippet),
        },
    };
};

export default overrideStories;
