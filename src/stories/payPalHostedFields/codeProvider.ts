import type { Story } from "@storybook/react";

import { Default as Provider } from "./PayPalHostedFieldsProvider.stories";
import { generateDocPageStructure } from "../commons";

const getProviderCode = (): string =>
    `import { useState, useEffect } from "react";
import {
	PayPalScriptProvider,
	PayPalHostedFieldsProvider,
	PayPalHostedField,
} from "@paypal/react-paypal-js";

export default function App() {
	const [clientToken, setClientToken] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await (
				await fetch(
					"https://braintree-sdk-demo.herokuapp.com/api/paypal/hosted-fields/auth"
				)
			).json();
			setClientToken(response?.client_token || response?.clientToken);
		})();
	}, []);

	return (
		<>
			{clientToken ? (
				<PayPalScriptProvider
					options={{
						"client-id":
							"AdOu-W3GPkrfuTbJNuW9dWVijxvhaXHFIRuKrLDwu14UDwTTHWMFkUwuu9D8I1MAQluERl9cFOd7Mfqe",
						components: "buttons,hosted-fields",
						"data-client-token": clientToken,
						intent: "capture",
						vault: false,
					}}
				>
					<PayPalHostedFieldsProvider
						createOrder={() => {
							// Server call to create the order
							// Mock response below 1
							return Promise.resolve("7NE43326GP4951156");
						}}
						styles={{
							".valid": {
								color: "#28a745",
							},
							".invalid": {
								color: "#dc3545",
							},
						}}
					>
						<PayPalHostedField
							id="card-number"
							className="card-field"
							hostedFieldType="number"
							options={{
								selector: "#card-number",
								placeholder: "4111 1111 1111 1111",
							}}
						/>
						<PayPalHostedField
							id="cvv"
							className="card-field"
							hostedFieldType="cvv"
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
							hostedFieldType="expirationDate"
							options={{
								selector: "#expiration-date",
								placeholder: "MM/YYYY",
							}}
						/>
					</PayPalHostedFieldsProvider>
				</PayPalScriptProvider>
			) : (
				<h1>Loading token...</h1>
			)}
		</>
	);
}`;

export const overrideStories = (): void => {
    (Provider as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getProviderCode()),
        },
    };
};
