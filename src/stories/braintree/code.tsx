import React from "react";
import reactElementToJSXString from "react-element-to-jsx-string";

import { PayPalScriptProvider, BraintreePayPalButtons } from "../../index";
import type { Story } from "@storybook/react";

export const getBillingAgreementCode = (snippet: Story): string =>
    reactElementToJSXString(
        <div
            style={{ maxWidth: "${snippet?.args?.size}px", minHeight: "200px" }}
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
                    fundingSource={snippet?.args?.fundingSource}
                    createBillingAgreement={(data, actions) =>
                        actions.braintree.createPayment({
                            flow: "vault", // Required

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
                        })
                    }
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
            showFunctions: true,
            functionValue: (fn) => fn.toString(),
        }
    );
