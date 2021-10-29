import type { Story } from "@storybook/react";

import { Default, Donate } from "./PayPalButtons.stories";
import { generateDocPageStructure } from "../commons";

const getDefaultCode = (): string =>
    `import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function App() {
	return (
		<div style={{ maxWidth: "750px", minHeight: "200px" }}>
			<PayPalScriptProvider
				options={{
					"client-id": "test",
					components: "buttons",
				}}
			>
				<PayPalButtons
					style={{
						layout: "vertical",
					}}
					disabled={false}
					fundingSource="" // Available values are: ["paypal", "card", "credit", "paylater", "venmo"]
					createOrder={(data, actions) => {
						return actions.order
							.create({
								purchase_units: [
									{
										amount: {
											currency_code: "USD", // Here change the currency if needed
											value: "2", // Here change the amount if needed
										},
									},
								],
							})
							.then((orderId) => {
								// Your code here after create the order
								return orderId;
							});
					}}
					onApprove={function (data, actions) {
						return actions.order.capture().then(function () {
							// Your code here after capture the order
						});
					}}
				/>
			</PayPalScriptProvider>
		</div>
	);
}`;

const getDonateCode = (): string =>
    `import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

 export default function App() {
     return (
         <div
             style={{ maxWidth: "750px", minHeight: "200px" }}
         >
             <PayPalScriptProvider
                 options={{
                     "client-id": "test",
                     components: "buttons",
                     "data-namespace": "set_unique_identifier_here",
                     "data-uid": "set_unique_identifier_here",
                 }}
             >
                 <PayPalButtons
                     fundingSource="paypal"
                     disabled={false}
                     style={{
                         layout: "vertical",
                         label: "donate",
                     }}
                     createOrder={(data, actions) => {
                         return actions.order
                             .create({
                                 purchase_units: [
                                     {
                                         amount: {
                                             value: "2", // Here change the amount if needed
                                             breakdown: {
                                                 item_total: {
                                                     currency_code: "USD", // Here change the currency if needed
                                                     value: "2", // Here change the amount if needed
                                                 },
                                             },
                                         },
                                         items: [
                                             {
                                                 name: "donation-example",
                                                 quantity: "1",
                                                 unit_amount: {
                                                     currency_code: "USD", // Here change the currency if needed
                                                     value: "2", // Here change the amount if needed
                                                 },
                                                 category: "DONATION",
                                             },
                                         ],
                                     },
                                 ],
                             })
                             .then((orderId) => {
                                 // Your code here after create the donation
                                 return orderId;
                             });
                     }}
                 />
             </PayPalScriptProvider>
         </div>
     );
 }`;

const overrideStories = (): void => {
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getDefaultCode()),
        },
    };

    // Override the Donate story code snippet
    (Donate as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getDonateCode()),
        },
    };

    // Override the Donate story controls table props
    (Donate as Story).argTypes = {
        fundingSource: { control: false },
        showSpinner: { table: { disable: true } },
    };
};

export default overrideStories;
