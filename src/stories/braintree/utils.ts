import type { Story } from "@storybook/react";
import { generateDocPageStructure } from "../commons";

import { Default, BillingAgreement } from "./BraintreePayPalButtons.stories";
import { getBillingAgreementCode } from "./code";

const providerScript = (
    intent = "capture",
    vault = false
) => `<PayPalScriptProvider
                options={{
            "client-id": "test",
            components: "buttons",
            "data-client-token": "your_data_client_token",
            "data-namespace": "set_unique_identifier_here",
            "data-uid": "set_unique_identifier_here",
            intent: "${intent}",
            vault: ${vault}
        }}
    >`;
const ON_APPROVE_DECLARATION = `onApprove={(data, actions) =>
                actions.braintree.tokenizePayment(data).then((payload) => {
                    approveSale(payload.nonce, amount).then((data) => {
                        // Your code here after capture the order
                    });
                })
            }`;
const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) => `
<div style={{ maxWidth: "${snippet?.args?.size}px", minHeight: "200px" }}>
    ${providerScript()}
        <BraintreePayPalButtons
            style={${JSON.stringify(snippet?.args?.style)}}
            disabled={${snippet?.args?.disabled}}
            fundingSource={${snippet?.args?.fundingSource}}
            forceReRender={[style, amount, currency]}
            createOrder={(data:, actions) =>
                actions.braintree
                    .createPayment({
                        flow: "checkout",
                        amount: "${snippet?.args?.amount}",
                        currency: "${snippet?.args?.currency}",
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
                    })
            }
            ${ON_APPROVE_DECLARATION}
        />
    </PayPalScriptProvider>
<div>`,
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
