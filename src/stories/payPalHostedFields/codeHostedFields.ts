import type { Story } from "@storybook/react";

import { Default, ExpirationDate } from "./PayPalHostedFields.stories";
import { generateDocPageStructure } from "../commons";

const EXPIRATION_DATE_SINGLE_FIELD = `<label htmlFor="card-number">
                            Card Number
                            <span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="card-number"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="number"
                            options={{
                                selector: "#card-number",
                                placeholder: "4111 1111 1111 1111",
                            }}
                        />
                        <label htmlFor="cvv">
                            CVV<span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="cvv"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="cvv"
                            options={{
                                selector: "#cvv",
                                placeholder: "123",
                                maskInput: true,
                            }}
                        />
                        <label htmlFor="expiration-date">
                            Expiration Date
                            <span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="expiration-date"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="expirationDate"
                            options={{
                                selector: "#expiration-date",
                                placeholder: "MM/YYYY",
                            }}
                        />`;

const EXPIRATION_DATE_MULTI_FIELD = `<PayPalHostedField
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
                                maskInput: true,
                            }}
                        />
                        <PayPalHostedField
							id="expiration-month-1"
							className="card-field"
							hostedFieldType="expirationMonth"
							options={{
								selector: "#expiration-month-1",
								placeholder: "MM",
							}}
						/>
						<PayPalHostedField
							id="expiration-year-1"
                            className="card-field"
							hostedFieldType="expirationYear"
							options={{
								selector: "#expiration-year-1",
								placeholder: "YYYY",
							}}
						/>
`;

const customInput = (includeLabel: boolean) => {
    const inputField = `<input
                id="card-holder"
                ref={cardHolderName}
                className="card-field"
                style={{ ...customStyle, outline: "none" }}
                type="text"
                placeholder="Full name"
            />`;
    return includeLabel
        ? `<label title="This represents the full name as shown in the card">
                Card Holder Name
                <input
                    id="card-holder"
                    ref={cardHolderName}
                    className="card-field"
                    style={{ ...customStyle, outline: "none" }}
                    type="text"
                    placeholder="Full name"
                />
                </label>`
        : inputField;
};

const getDefaultCode = (fields: string, includeLabel: boolean): string =>
    `import { useState, useEffect, useRef } from "react";
import {
	PayPalScriptProvider,
	PayPalHostedFieldsProvider,
	PayPalHostedField,
	usePayPalHostedFields,
} from "@paypal/react-paypal-js";

const CUSTOM_FIELD_STYLE = {
	border: "1px solid #606060",
	boxShadow: "2px 2px 10px 2px rgba(0,0,0,0.1)",
};
const INVALID_COLOR = {
	color: "#dc3545",
};

// Example of custom component to handle form submit
const SubmitPayment = ({ customStyle }) => {
	const [paying, setPaying] = useState(false);
	const cardHolderName = useRef(null);
	const hostedField = usePayPalHostedFields();

	const handleClick = () => {
		if (hostedField) {
			if (
				Object.values(hostedField.getState().fields).some(
					(field) => !field.isValid
				) ||
				!cardHolderName?.current?.value
			) {
				return alert(
					"The payment form is invalid, please check it before execute the payment"
				);
			}
			setPaying(true);
			hostedField
				.submit({
					cardholderName: cardHolderName?.current?.value,
				})
				.then((data) => {
					// Your logic to capture the transaction
					fetch("url_to_capture_transaction", {
						method: "post",
					})
						.then((response) => response.json())
						.then((data) => {
							// Here use the captured info
						})
						.catch((err) => {
							// Here handle error
						})
						.finally(() => {
							setPaying(false);
						});
				})
				.catch((err) => {
					// Here handle error
					setPaying(false);
				});
		}
	};

	return (
		<>
            ${customInput(includeLabel)}
			<button
				className={\`btn\${paying ? "" : " btn-primary"}\`}
				style={{ float: "right" }}
				onClick={handleClick}
			>
				{paying ? <div className="spinner tiny" /> : "Pay"}
			</button>
		</>
	);
};

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
						styles={{
							".valid": {
								color: "#28a745",
							},
							".invalid": INVALID_COLOR,
						}}
						createOrder={function () {
							return fetch(
								"your_custom_server_to_create_orders",
								{
									method: "post",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										purchase_units: [
											{
												amount: {
													value: "2", // Here change the amount if needed
													currency_code: "USD", // Here change the currency if needed
												},
											},
										],
										intent: "capture",
									}),
								}
							)
								.then((response) => response.json())
								.then((order) => {
									// Your code here after create the order
									return order.id;
								})
								.catch((err) => {
									alert(err);
								});
						}}
					>
                        ${fields}
						<SubmitPayment />
					</PayPalHostedFieldsProvider>
				</PayPalScriptProvider>
			) : (
				<h1>Loading token...</h1>
			)}
		</>
	);
}`;

export const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () =>
                generateDocPageStructure(
                    getDefaultCode(EXPIRATION_DATE_SINGLE_FIELD, true)
                ),
        },
    };

    (ExpirationDate as Story).parameters = {
        docs: {
            page: () =>
                generateDocPageStructure(
                    getDefaultCode(EXPIRATION_DATE_MULTI_FIELD, false)
                ),
        },
    };
};
