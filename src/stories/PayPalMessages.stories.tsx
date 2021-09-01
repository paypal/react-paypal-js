import React, { FC } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import { PayPalScriptProvider, PayPalMessages } from "../index";
import { getOptionsFromQueryString } from "./utils";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "messages",
    ...getOptionsFromQueryString(),
};

export default {
    title: "PayPal/PayPalMessages",
    component: PayPalMessages,
    parameters: {
        controls: { expanded: true },
        actions: { disable: true },
        docs: { source: { type: "dynamic" } },
    },
    argTypes: {
        style: {
            description:
                "Make inline change in the way the component will be render.",
        },
        forceReRender: {
            control: null,
            description:
                "List of dependencies to re-render the PayPal messages component. This is similar to the useEffect hook dependencies list.",
        },
        className: {
            control: null,
            description: "Pass a CSS class to the div container.",
        },
        account: {
            control: null,
            description: "Set the account identifier.",
        },
        amount: {
            control: null,
            description:
                "This represent the amount of money to charge. Can be a numeric value `10` or a string value `'10.00'`",
        },
    },
    args: {
        style: { layout: "text" },
    },
};

export const Default: FC<{
    style: {
        layout?: "text" | "flex" | "custom";
        color: string;
    };
}> = ({ style }) => (
    <PayPalScriptProvider options={scriptProviderOptions}>
        <PayPalMessages style={style} forceReRender={[style]} />
    </PayPalScriptProvider>
);
