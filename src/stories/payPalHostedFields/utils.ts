import type { Story } from "@storybook/react";
import { generateDocPageStructure } from "../commons";

import { Default, ExpirationDate } from "./PayPalHostedFields.stories";
import { Default as Provider } from "./PayPalHostedFieldsProvider.stories";

const stylesProps = (styles: string) => `styles={${styles}}`;
const SUBMIT_PAYMENT_DECLARATION = `// This is a custom component to submit the form
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

const createOrderDeclaration = (snippet: Story) => `createOrder={() =>
                    fetch("your_custom_server_to_create_orders", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            purchase_units: [
                                {
                                    amount: {
                                        value: "${snippet?.args?.amount}",
                                        currency_code: "${snippet?.args?.currency}",
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
                    })
                }`;

const overrideStories = (redColor: string, greenColor: string): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) => `() => {
    const RED_COLOR_STYLE = { color: "${redColor}" };
    const GREEN_COLOR_STYLE = { color: "${greenColor}" };
    const CUSTOM_BORDER_FIELD_STYLE = ${JSON.stringify(
        snippet?.args?.fieldStyle
    )};
    ${SUBMIT_PAYMENT_DECLARATION}
    
    return (
        <PayPalHostedFieldsProvider
            ${createOrderDeclaration(snippet)}
            ${stylesProps(JSON.stringify(snippet?.args?.styles))}
        >
            <label htmlFor="card-number">Card Number<span style={RED_COLOR_STYLE}>*</span></label>
            <PayPalHostedField
                id="card-number"
                className="card-field"
                style={CUSTOM_BORDER_FIELD_STYLE}
                hostedFieldType"number"
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <label htmlFor="cvv">CVV<span style={RED_COLOR_STYLE}>*</span></label>
            <PayPalHostedField
                id="cvv"
                className="card-field"
                style={CUSTOM_BORDER_FIELD_STYLE}
                hostedFieldType="cvv"
                options={{
                    selector: "#cvv",
                    placeholder: "123",
                    maskInput: true,
                }}
            />
            <label htmlFor="expiration-date">Expiration Date<span style={RED_COLOR_STYLE}>*</span></label>
            <PayPalHostedField
                id="expiration-date"
                className="card-field"
                style={CUSTOM_BORDER_FIELD_STYLE}
                hostedFieldType="expirationDate"
                options={{
                    selector: "#expiration-date",
                    placeholder: "MM/YYYY",
                }}
            />
            <SubmitPayment />
        </PayPalHostedFieldsProvider>
    );
}`,
        },
    };

    (ExpirationDate as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure("Expiration Date"),
            transformSource: (_: string, snippet: Story) => `
                () => {
        const RED_COLOR_STYLE = { color: "${redColor}" };
        const GREEN_COLOR_STYLE = { color: "${greenColor}" };
        ${SUBMIT_PAYMENT_DECLARATION}
    
        return (
            <PayPalHostedFieldsProvider
                ${createOrderDeclaration(snippet)}
                ${stylesProps(JSON.stringify(snippet?.args?.styles))}
            >
                <label htmlFor="card-number">Card Number<span style={RED_COLOR_STYLE}>*</span></label>
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
                    options={{ selector: "#expiration-month-1", placeholder: "MM" }}
                />
                <PayPalHostedField
                    id="expiration-year-1"
                    hostedFieldType="expirationYear"
                    options={{
                        selector: "#expiration-year-1",
                        placeholder: "YYYY",
                    }}
                />
                <SubmitPayment />
            </PayPalHostedFieldsProvider>
        );
    }`,
        },
    };
    (Provider as Story).parameters = {
        docs: {
            transformSource: (
                _: string,
                snippet: Story
            ) => `<PayPalHostedFieldsProvider
    createOrder={() => {
            // Server call to create the order
            // Mock response below
            return Promise.resolve("7NE43326GP4951156");
        }}
        styles={${JSON.stringify(snippet?.args?.styles)}}
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
</PayPalHostedFieldsProvider>`,
        },
    };
};

export default overrideStories;
