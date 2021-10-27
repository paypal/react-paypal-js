import type { Story } from "@storybook/react";
import { generateDocPageStructure } from "../commons";

import { Default, Donate } from "./PayPalButtons.stories";

const PAYPAL_PROVIDER = `<PayPalScriptProvider
        options={{
            'client-id': 'test',
            components: 'buttons',
            'data-namespace': 'set_unique_identifier_here',
            'data-uid': 'set_unique_identifier_here'
        }}
    >`;
const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) => `
<div style={{ maxWidth: "${snippet?.args?.size}px", minHeight: "200px" }}>
    ${PAYPAL_PROVIDER}
        <PayPalButtons
            style={${JSON.stringify(snippet?.args?.style)}}
            disabled={${snippet?.args?.disabled}}
            fundingSource="${snippet?.args?.fundingSource || ""}"
            forceReRender={[style, currency, amount]}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "${snippet?.args?.currency}",
                                    value: "${snippet?.args?.amount}",
                                },
                            },
                        ],
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            onApprove={(data: OnApproveData, actions: OnApproveActions) => {
                return actions.order.capture().then(function (details) {
                    // Your code here after capture the order
                });
            }}
        />
    </PayPalScriptProvider>
<div>`,
        },
    };

    // Override the Donate story code snippet
    (Donate as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Donate.name),
            transformSource: (_: string, snippet: Story) => `
<div style={{ maxWidth: "${snippet?.args?.size}px", minHeight: "200px" }}>
    ${PAYPAL_PROVIDER}
        <PayPalButtons
            fundingSource="paypal"
            forceReRender={[style, currency, amount]}
            disabled={${snippet?.args?.disabled}}
            style={${JSON.stringify({
                ...snippet?.args?.style,
                label: "donate",
            })}}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        purchase_units: [
                            {
                                amount: {
                                    value: "${snippet?.args?.amount}",
                                    breakdown: {
                                        item_total: {
                                            currency_code: "${
                                                snippet?.args?.currency
                                            }",
                                            value: "${snippet?.args?.amount}",
                                        },
                                    },
                                },
                                items: [
                                    {
                                        name: "donation-example",
                                        quantity: "1",
                                        unit_amount: {
                                            currency_code: "${
                                                snippet?.args?.currency
                                            }",
                                            value: "${snippet?.args?.amount}",
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
        >
    </PayPalScriptProvider>
<div>`,
        },
    };

    // Override the Donate story controls table props
    (Donate as Story).argTypes = {
        fundingSource: { control: false },
        showSpinner: { table: { disable: true } },
    };
};

export default overrideStories;
