import { generateFundingSource } from "../utils";

import type { Args } from "@storybook/addons/dist/ts3.9/types";

export const getDefaultCode = (fundingSource?: string): string =>
    `import { PayPalScriptProvider, PayPalMarks } from "@paypal/react-paypal-js";

export default function App() {
	return (
		<PayPalScriptProvider
			options={{
				"client-id": "test",
				components: "buttons,marks,funding-eligibility",
			}}
		>
			<PayPalMarks ${generateFundingSource(fundingSource)}/>
		</PayPalScriptProvider>
	);
}`;

export const getRadioButtonsCode = (args: Args): string =>
    `import { useState } from "react";
import {
	PayPalScriptProvider,
	PayPalButtons,
	PayPalMarks,
} from "@paypal/react-paypal-js";

export default function App() {
	const fundingSources = ["paypal", "card", "paylater"];
	// Remember the amount props is received from the control panel
	const [selectedFundingSource, setSelectedFundingSource] = useState(
		fundingSources[0]
	);

	function onChange(event) {
		setSelectedFundingSource(event.target.value);
	}

	return (
		<PayPalScriptProvider
			options={{
				"client-id": "test",
				components: "buttons,marks,funding-eligibility"
			}}
		>
			<form style={{ minHeight: "200px" }}>
				{fundingSources.map((fundingSource) => (
					<label className="mark" key={fundingSource}>
						<input
							defaultChecked={
								fundingSource === selectedFundingSource
							}
							onChange={onChange}
							type="radio"
							name="fundingSource"
							value={fundingSource}
						/>
						<PayPalMarks fundingSource={fundingSource} />
					</label>
				))}
			</form>
			<br />
			<PayPalButtons
				fundingSource={selectedFundingSource}
				style={${JSON.stringify(args.style)}}
				forceReRender={[selectedFundingSource,${JSON.stringify(args.style)}, "${args.amount}", "${args.currency}"]}
				createOrder={(data, actions) => {
					return actions.order
						.create({
							purchase_units: [
								{
									amount: {
										currency_code: "${args.currency}", // Here change the currency if needed
										value: "${args.amount}", // Here change the amount if needed
									},
								},
							],
						})
						.then((orderId) => {
							// Your code here after create the order
							return orderId;
						});
				}}
				onApprove={(data, actions) => {
					return actions.order.capture().then(function (details) {
						// Your code here after approve the transaction
					});
				}}
			/>
		</PayPalScriptProvider>
	);
}`;
