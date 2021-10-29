import React from "react";
import type { Story } from "@storybook/react";

import { Default as Provider } from "./PayPalHostedFieldsProvider.stories";
import { PayPalHostedFieldsProvider, PayPalHostedField } from "../../index";
import { reactElementToString } from "../utils";

const getProviderCode = (snippet: Story): string =>
    reactElementToString(
        <PayPalHostedFieldsProvider
            createOrder={() => {
                // Server call to create the order
                // Mock response below 1
                return Promise.resolve("7NE43326GP4951156");
            }}
            styles={snippet?.args?.styles}
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
        </PayPalHostedFieldsProvider>,
        {
            amount: snippet?.args?.amount,
            currency: snippet?.args?.currency,
        }
    );

export const overrideStories = (): void => {
    (Provider as Story).parameters = {
        docs: {
            transformSource: (_: string, snippet: Story) =>
                getProviderCode(snippet),
        },
    };
};
