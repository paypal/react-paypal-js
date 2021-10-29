import type { Story } from "@storybook/react";

import { Default } from "./Subscriptions.stories";
import { generateDocPageStructure } from "../commons";

const getDefaultCode = (): string =>
    `import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function App() {
	return (
		<PayPalScriptProvider
			options={{
				"client-id": "test",
				components: "buttons",
				intent: "subscription",
				vault: true,
			}}
		>
			<PayPalButtons
				createSubscription={(data, actions) => {
					return actions.subscription
						.create({
							plan_id: "P-3RX065706M3469222L5IFM4I",
						})
						.then((orderId) => {
							// Your code here after create the order
							return orderId;
						});
				}}
				style={{
					label: "subscribe",
				}}
			/>
		</PayPalScriptProvider>
	);
}`;

const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getDefaultCode()),
        },
    };
};

export default overrideStories;
