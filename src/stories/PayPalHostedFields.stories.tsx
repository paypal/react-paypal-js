import React, { useState, useEffect, useRef } from "react";
import type { FC, ReactElement } from "react";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import {
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    PAYPAL_HOSTED_FIELDS_TYPES,
    usePayPalHostedFields,
} from "../index";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
} from "./utils";

const CREATE_ORDER_URL =
    "https://braintree-sdk-demo.herokuapp.com/api/paypal/checkout/orders";
const scriptProviderOptions: PayPalScriptOptions = {
    "client-id":
        "AdOu-W3GPkrfuTbJNuW9dWVijxvhaXHFIRuKrLDwu14UDwTTHWMFkUwuu9D8I1MAQluERl9cFOd7Mfqe",
    components: "hosted-fields",
    ...getOptionsFromQueryString(),
};

function captureOrderUrl(orderId: string): string {
    return `http://localhost:5000/api/paypal/checkout/orders/${orderId}/capture`;
}

// Component to show the client isn't eligible to use hosted fields
const NotEligibleError = () => (
    <h3>Your client is not able to use hosted fields</h3>
);

// Component to manually handle the submit process
const SubmitPayment = () => {
    const [paying, setPaying] = useState(false);
    const cardHolderName = useRef<HTMLInputElement>(null);
    const hostedField = usePayPalHostedFields();

    const handleClick = () => {
        if (
            hostedField &&
            cardHolderName.current &&
            cardHolderName.current.value
        ) {
            setPaying(true);
            hostedField
                .submit({
                    cardholderName: cardHolderName.current.value,
                })
                .then((data) => {
                    console.log("orderId: ", data.orderId);
                    fetch(captureOrderUrl(data.orderId))
                        .then((response) => response.json())
                        .then((data) => {
                            alert(JSON.stringify(data));
                        })
                        .catch((err) => {
                            alert(JSON.stringify(err));
                        })
                        .finally(() => {
                            setPaying(false);
                        });
                });
        }
    };

    return (
        <>
            <input
                ref={cardHolderName}
                className="card_field"
                type="text"
                placeholder="Card holder name "
            />
            <button
                className={`btn${paying ? "" : " btn-primary"}`}
                style={{ float: "right" }}
                onClick={handleClick}
            >
                {paying ? <div className="spinner tiny" /> : "Pay"}
            </button>
        </>
    );
};

export default {
    title: "Example/PayPalHostedFields",
    component: PayPalHostedFieldsProvider,
    argTypes: {
        style: { control: null },
    },
    args: {
        // Storybook passes empty functions by default for props like `onShippingChange`.
        // This turns on the `onShippingChange()` feature which uses the popup experience with the Standard Card button.
        // We pass null to opt-out so the inline guest feature works as expected with the Standard Card button.
        onShippingChange: null,
    },
    decorators: [
        (Story: FC): ReactElement => {
            // Workaround to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);
            const uid = generateRandomString();

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken());
                })();
            }, []);

            return (
                <div style={{ minHeight: "200px" }}>
                    {clientToken != null && (
                        <>
                            <PayPalScriptProvider
                                options={{
                                    ...scriptProviderOptions,
                                    "data-client-token":
                                        "eyJicmFpbnRyZWUiOnsiYXV0aG9yaXphdGlvbkZpbmdlcnByaW50IjoiNzhlNGI3NzlmZjYwMjA0OWNjYzE2NTViMDlmZWQ0MDM2NWY3NzlmYzgwNmY3MDljODZjMzVmMGJiYjYyMzQ5N3xtZXJjaGFudF9pZD1yd3dua3FnMnhnNTZobTJuJnB1YmxpY19rZXk9NjNrdm4zN3Z0MjlxYjRkZiZjcmVhdGVkX2F0PTIwMjEtMDktMjNUMjE6NDM6MDUuNjc0WiIsInZlcnNpb24iOiIzLXBheXBhbCJ9LCJwYXlwYWwiOnsiaWRUb2tlbiI6ImV5SnJhV1FpT2lKbE5EQTJOakE0WWpVMFlUazBORGd4WWprMVl6YzFOREkwT0dOak1USXpaaUlzSW5SNWNDSTZJa3BYVkNJc0ltRnNaeUk2SWxKVE1qVTJJbjAuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZ3YVM1ellXNWtZbTk0TG5CaGVYQmhiQzVqYjIwaUxDSmhZM0lpT2xzaVkyeHBaVzUwSWwwc0ltRjFaQ0k2SWtGa1QzVXRWek5IVUd0eVpuVlVZa3BPZFZjNVpGZFdhV3A0ZG1oaFdFaEdTVkoxUzNKTVJIZDFNVFJWUkhkVVZFaFhUVVpyVlhkMWRUbEVPRWt4VFVGUmJIVkZVbXc1WTBaUFpEZE5abkZsSWl3aWNtOXNaU0k2SWsxRlVrTklRVTVVSWl3aVlYVjBhRjkwYVcxbElqb3hOak15TkRNek16ZzFMQ0poZWlJNkltZGpjQzV6YkdNaUxDSnpZMjl3WlhNaU9sc2lRbkpoYVc1MGNtVmxPbFpoZFd4MElsMHNJbVY0Y0NJNk1UWXpNalF6TkRJNE5pd2ljMlZ6YzJsdmJsOXBibVJsZUNJNklqUkhTWGhLV25KS01VUTRiMGN0VnpWTk5rRkJSbk5QUkY5QmVTSXNJbWxoZENJNk1UWXpNalF6TXpNNE5pd2lhblJwSWpvaVZUSkJRVXhOTWtkNWJtdDJiMlZKUm1NM09ESjZXbEo1Y0hkaWQzZFBRbHBHWlhZeFJuRTVjbWs1WVZWcVZuSjNibEJKU1RoM1dYVklUbTVIYzFKMWQxbEdVVWhCVm5SSE1teE9Wa04yUmw5SlpYUnBha1JrWjJkck5XUTRiMmhzWDA5bGEzZ3lhRjlKYjA5TGNURm5TMU5aVkRJd1ptOHpZWGRKZW5oUlVWRWlMQ0pqYkdsbGJuUmZhV1FpT2lKQlpFOTFMVmN6UjFCcmNtWjFWR0pLVG5WWE9XUlhWbWxxZUhab1lWaElSa2xTZFV0eVRFUjNkVEUwVlVSM1ZGUklWMDFHYTFWM2RYVTVSRGhKTVUxQlVXeDFSVkpzT1dOR1QyUTNUV1p4WlNKOS5OS3lpVjhKVEtfa2MwMkFqSmxaWEowTjBNdE9KallQSEdzVkVoU2NGekMtMlVOWDhIMDJFNXdERWxTM240cWRwTzUzYkZKQTdINDdLV0hXTVlhdmhFZ25UNVMwNnVrbVpySnJGU2NMVHJTS2hLMUdPenB1cjgwcTgzUXhkOG9vMVlrN1pUVThZbnBueXg2RTloSllCWFBJcm5icTF2dUplMVZIYVFKbnpUQVlrWEd0UDFkNElVVlREQ0Z6VExqbjlTc2xnYjBXLUZwdzM0UjNlM05jRWJSZGtZYm1MQXZzdVlMSF91TnR2MDZBazFFNHRaX2JwQTJVdmt0LURKVGgyQnhBbkpXWExESmhTaGpMVHBxNzhTM3hCQlN2SWJKVFZIS2xWZHZzQk1NN1VzQmdwV0VIVEt3dGhwSTVKbF84Rnpyb3pEWHVqUTQzcFpFRFlxQ0VhLUEiLCJhY2Nlc3NUb2tlbiI6IkEyMUFBTGRaaFNGbF9sUE4yNEdTeTI4TFRPeVVTYS1nWnZWb09qVjF6RHVmd0s3eWh2enk5U0ZsemVheEJkZHJ1VVFoVzNYR2dLMWhyZngwY3FMUlhSakxvLWZlQnd4RXcifX0=",
                                    "data-namespace": uid,
                                    "data-uid": uid,
                                }}
                            >
                                <Story />
                            </PayPalScriptProvider>
                        </>
                    )}
                </div>
            );
        },
    ],
};

export const Default: FC = () => {
    return (
        <PayPalHostedFieldsProvider
            //"https://www.sandbox.paypal.com/v2/checkout/orders"
            createOrder={() =>
                fetch(CREATE_ORDER_URL)
                    .then((response) => response.json())
                    .then((order) => order.id)
                    .catch((err) => {
                        alert(err);
                    })
            }
            notEligibleError={<NotEligibleError />}
            styles={{
                ".valid": { color: "#28a745" },
                ".invalid": { color: "#dc3545" },
            }}
        >
            <PayPalHostedField
                id="card-number"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <PayPalHostedField
                id="cvv"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                options={{
                    selector: "#cvv",
                    placeholder: "123",
                    maskInput: true,
                }}
            />
            <PayPalHostedField
                id="expiration-date"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                options={{
                    selector: "#expiration-date",
                    placeholder: "MM/YYYY",
                }}
            />
            {/* Custom client component to handle hosted fields submit */}
            <SubmitPayment />
        </PayPalHostedFieldsProvider>
    );
};

export const ExpirationDate: FC = () => {
    return (
        <PayPalHostedFieldsProvider
            createOrder={() =>
                fetch(
                    "https://braintree-sdk-demo.herokuapp.com/api/paypal/checkout/orders"
                )
                    .then((response) => response.json())
                    .then((order) => order.id)
                    .catch((err) => {
                        alert(err);
                    })
            }
            notEligibleError={<NotEligibleError />}
            styles={{
                ".valid": { color: "#28a745" },
                ".invalid": { color: "#dc3545" },
            }}
        >
            <PayPalHostedField
                id="card-number"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                }}
            />
            <PayPalHostedField
                id="cvv"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                options={{
                    selector: "#cvv",
                    placeholder: "123",
                    maskInput: true,
                }}
            />
            <PayPalHostedField
                id="expiration-month"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH}
                options={{ selector: "#expiration-month", placeholder: "MM" }}
            />
            <PayPalHostedField
                id="expiration-year"
                className="card_field"
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_YEAR}
                options={{ selector: "#expiration-year", placeholder: "YEAR" }}
            />
            {/* Custom client component to handle hosted fields submit */}
            <SubmitPayment />
        </PayPalHostedFieldsProvider>
    );
};
