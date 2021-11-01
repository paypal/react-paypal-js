import React, { FC } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type { Story } from "@storybook/react";

import { PayPalScriptProvider, PayPalMessages } from "../index";
import { getOptionsFromQueryString } from "./utils";
import { COMPONENT_PROPS_CATEGORY } from "./constants";
import { generateDocPageStructure } from "./commons";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "messages",
    ...getOptionsFromQueryString(),
};

export default {
    id: "example/PayPalMessages",
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
            ...COMPONENT_PROPS_CATEGORY,
        },
        forceReRender: {
            control: null,
            description:
                "List of dependencies to re-render the PayPal messages component. This is similar to the useEffect hook dependencies list.",
            ...COMPONENT_PROPS_CATEGORY,
        },
        className: {
            control: null,
            description: "Pass a CSS class to the div container.",
            ...COMPONENT_PROPS_CATEGORY,
        },
        account: {
            control: null,
            description: "Set the account identifier.",
            ...COMPONENT_PROPS_CATEGORY,
        },
        amount: {
            control: null,
            description:
                "This represent the amount of money to charge. Can be a numeric value `10` or a string value `'10.00'`",
            ...COMPONENT_PROPS_CATEGORY,
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

const getDefaultCode = (): string =>
    `import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js";

export default function App() {
	return (
		<PayPalScriptProvider
			options={{
				"client-id": "test",
				components: "messages",
			}}
		>
			<PayPalMessages
				style={{
					layout: "text",
				}}
			/>
		</PayPalScriptProvider>
	);
}`;

(Default as Story).parameters = {
    docs: {
        page: () => generateDocPageStructure(getDefaultCode()),
    },
};
