import type { Story } from "@storybook/react";

import { Default, BillingAgreement } from "./BraintreePayPalButtons.stories";
import { generateDocPageStructure } from "../commons";

const getDefaultCode = (): string =>
    `import { useState, useEffect } from "react";
import {
	PayPalScriptProvider,
	BraintreePayPalButtons,
} from "@paypal/react-paypal-js";

export default function App() {
	const [clientToken, setClientToken] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await (
				await fetch(
					"https://braintree-sdk-demo.herokuapp.com/api/braintree/auth"
				)
			).json();
			setClientToken(response?.client_token || response?.clientToken);
		})();
	}, []);

	return (
		<>
			{clientToken ? (
				<div style={{ maxWidth: "750px", minHeight: "200px" }}>
					<PayPalScriptProvider
						options={{
							"client-id": "test",
							components: "buttons",
							"data-client-token": clientToken,
							intent: "capture",
							vault: false,
						}}
					>
						<BraintreePayPalButtons
							style={{
								label: "paypal",
								layout: "vertical",
							}}
							disabled={false}
							fundingSource="" // Available values are: ["paypal", "card", "credit", "paylater", "venmo"]
							createOrder={function (data, actions) {
								return actions.braintree
									.createPayment({
										flow: "checkout",
										amount: "2", // Here change the amount if needed
										currency: "USD", // Here change the currency if needed
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
				</div>
			) : (
				<h1>Loading token...</h1>
			)}
		</>
	);
}`;

const getBillingAgreementCode = (): string =>
    `import { useState, useEffect } from "react";
import {
	PayPalScriptProvider,
	BraintreePayPalButtons,
} from "@paypal/react-paypal-js";

export default function App() {
	const [clientToken, setClientToken] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await (
				await fetch(
					"https://braintree-sdk-demo.herokuapp.com/api/braintree/auth"
				)
			).json();
			setClientToken(response?.client_token || response?.clientToken);
		})();
	}, []);

	return (
		<>
			{clientToken ? (
				<div style={{ maxWidth: "750px", minHeight: "200px" }}>
					<PayPalScriptProvider
						options={{
							"client-id": "test",
							components: "buttons",
							"data-client-token": clientToken,
							intent: "tokenize",
							vault: true,
						}}
					>
						<BraintreePayPalButtons
							style={{
								label: "paypal",
								layout: "vertical",
							}}
							disabled={false}
							fundingSource="" // Available values are: ["paypal", "card", "credit", "paylater", "venmo"]
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
			) : (
				<h1>Loading token...</h1>
			)}
		</>
	);
}`;

const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getDefaultCode()),
        },
    };

    (BillingAgreement as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getBillingAgreementCode()),
        },
    };
};

export default overrideStories;
