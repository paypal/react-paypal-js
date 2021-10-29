import React from "react";
import type { Story } from "@storybook/react";

import { Default, ExpirationDate } from "./PayPalHostedFields.stories";
import { PayPalHostedFieldsProvider, PayPalHostedField } from "../../index";
import { generateDocPageStructure } from "../commons";
import { reactElementToString } from "../utils";

const SUBMIT_PAYMENT_DECLARATION = `
// HERE_YOUR_CUSTOM_FORM_SUBMIT_COMPONENT: <SubmitPayment />
        // This is an example
        const SubmitPayment = () => {
            const cardHolderName = useRef(null);
            const hostedField = usePayPalHostedFields();

            const handleClick = () => {
                if (hostedField) {
                    if (
                        Object.values(hostedField.getState().fields)
                        .some((field) => !field.isValid) ||
                        !cardHolderName?.current?.value
                    ) {
                        return alert(
                            "The payment form is invalid, please check it before execute the payment"
                        );
                    }

                    hostedField
                        .submit({
                            cardholderName: cardHolderName.current.value,
                        })
                        .then((data) => {
                            // Your code to capture the order check the example below
                            fetch(captureOrderUrl(data.orderId), {
                                method: "post",
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                alert(JSON.stringify(data));
                            })
                            .catch((err) => {
                                alert(JSON.stringify(err));
                            })
                        })
                        .catch((err) => {
                            alert(JSON.stringify(err));
                        });
                }
            };

            return (
                <>
                    <label title="This represents the full name as shown in the card">Card Holder Name</label>
                    <input
                        ref={cardHolderName}
                        className="card-field"
                        type="text"
                        placeholder="Full name"
                    />
                    <button
                        className="btn-primary"
                        style={{ float: "right" }}
                        onClick={handleClick}
                    >Pay</button>
                </>
            );
        };`;

const getDefaultCode = (snippet: Story): string =>
    reactElementToString(
        <PayPalHostedFieldsProvider
            styles={snippet?.args?.styles}
            createOrder={function () {
                return fetch("your_custom_server_to_create_orders", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        purchase_units: [
                            {
                                amount: {
                                    value: "{amount}",
                                    currency_code: "{currency}",
                                },
                            },
                        ],
                        intent: "capture",
                    }),
                })
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
            <label htmlFor="card-number">
                Card Number<span style={{ color: "#dc3545" }}>*</span>
            </label>
            <PayPalHostedField
                id="card-number"
                className="card-field"
                style={snippet?.args?.style}
                hostedFieldType="number"
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <label htmlFor="cvv">
                CVV<span style={{ color: "#dc3545" }}>*</span>
            </label>
            <PayPalHostedField
                id="cvv"
                className="card-field"
                style={snippet?.args?.style}
                hostedFieldType="cvv"
                options={{
                    selector: "#cvv",
                    placeholder: "123",
                    maskInput: true,
                }}
            />
            <label htmlFor="expiration-date">
                Expiration Date<span style={{ color: "#dc3545" }}>*</span>
            </label>
            <PayPalHostedField
                id="expiration-date"
                className="card-field"
                style={snippet?.args?.style}
                hostedFieldType="expirationDate"
                options={{
                    selector: "#expiration-date",
                    placeholder: "MM/YYYY",
                }}
            />
            {SUBMIT_PAYMENT_DECLARATION}
        </PayPalHostedFieldsProvider>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

const getExpirationDateCode = (snippet: Story): string =>
    reactElementToString(
        <PayPalHostedFieldsProvider
            styles={snippet?.args?.styles}
            createOrder={function () {
                return fetch("your_custom_server_to_create_orders", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        purchase_units: [
                            {
                                amount: {
                                    value: "{amount}",
                                    currency_code: "{currency}",
                                },
                            },
                        ],
                        intent: "capture",
                    }),
                })
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
            <label htmlFor="card-number">
                Card Number<span style={{ color: "#dc3545" }}>*</span>
            </label>
            <PayPalHostedField
                id="card-number-1"
                className="card-field"
                hostedFieldType="number"
                options={{
                    selector: "#card-number-1",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <PayPalHostedField
                id="cvv-1"
                className="card-field"
                hostedFieldType="cvv"
                options={{
                    selector: "#cvv-1",
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
                hostedFieldType="expirationYear"
                options={{
                    selector: "#expiration-year-1",
                    placeholder: "YYYY",
                }}
            />
            {SUBMIT_PAYMENT_DECLARATION}
        </PayPalHostedFieldsProvider>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

export const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) =>
                getDefaultCode(snippet),
        },
    };

    (ExpirationDate as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure("Expiration Date"),
            transformSource: (_: string, snippet: Story) =>
                getExpirationDateCode(snippet),
        },
    };
};
