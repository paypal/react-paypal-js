import React from "react";
import type { Story } from "@storybook/react";

import { Default, Donate } from "./PayPalButtons.stories";
import { PayPalScriptProvider, PayPalButtons } from "../../index";
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
                    "data-namespace": "set_unique_identifier_here",
                    "data-uid": "set_unique_identifier_here",
                }}
            >
                <PayPalButtons
                    style={snippet?.args?.style}
                    disabled={snippet?.args?.disabled}
                    fundingSource={snippet?.args?.fundingSource || false}
                    createOrder={(data, actions) => {
                        return actions.order
                            .create({
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "{currency}",
                                            value: "{amount}",
                                        },
                                    },
                                ],
                            })
                            .then((orderId) => {
                                // Your code here after create the order
                                return orderId;
                            });
                    }}
                    onApprove={function (data, actions) {
                        return actions.order.capture().then(function () {
                            // Your code here after capture the order
                        });
                    }}
                />
            </PayPalScriptProvider>
        </div>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

const getDonateCode = (snippet: Story): string =>
    reactElementToString(
        <div
            style={{ maxWidth: `${snippet?.args?.size}px`, minHeight: "200px" }}
        >
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    components: "buttons",
                    "data-namespace": "set_unique_identifier_here",
                    "data-uid": "set_unique_identifier_here",
                }}
            >
                <PayPalButtons
                    fundingSource="paypal"
                    disabled={snippet?.args?.disabled}
                    style={{
                        ...snippet?.args?.style,
                        label: "donate",
                    }}
                    createOrder={(data, actions) => {
                        return actions.order
                            .create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: "{amount}",
                                            breakdown: {
                                                item_total: {
                                                    currency_code: "{currency}",
                                                    value: "{amount}",
                                                },
                                            },
                                        },
                                        items: [
                                            {
                                                name: "donation-example",
                                                quantity: "1",
                                                unit_amount: {
                                                    currency_code: "{currency}",
                                                    value: "{amount}",
                                                },
                                                category: "DONATION",
                                            },
                                        ],
                                    },
                                ],
                            })
                            .then((orderId) => {
                                // Your code here after create the donation
                                return orderId;
                            });
                    }}
                />
            </PayPalScriptProvider>
        </div>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) =>
                getDefaultCode(snippet),
        },
    };

    // Override the Donate story code snippet
    (Donate as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Donate.name),
            transformSource: (_: string, snippet: Story) =>
                getDonateCode(snippet),
        },
    };

    // Override the Donate story controls table props
    (Donate as Story).argTypes = {
        fundingSource: { control: false },
        showSpinner: { table: { disable: true } },
    };
};

export default overrideStories;
