import type { Story } from "@storybook/react";

import { Default, RadioButtons } from "./PayPalMarks.stories";
import { generateDocPageStructure } from "../commons";

const getDefaultCode = (): string =>
    `import { PayPalScriptProvider, PayPalMarks } from "@paypal/react-paypal-js";

export default function App() {
	return (
		<PayPalScriptProvider
			options={{
				"client-id": "test",
				components: "buttons,marks,funding-eligibility",
			}}
		>
			<PayPalMarks />
		</PayPalScriptProvider>
	);
}`;

const getRadioButtonsCode = (): string =>
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
				style={{ color: "white" }}
				createOrder={(data, actions) => {
					return actions.order
						.create({
							purchase_units: [
								{
									amount: {
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
				onApprove={(data, actions) => {
					return actions.order.capture().then(function (details) {
						// Your code here after approve the transaction
					});
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

    // Override the Donate story code snippet
    (RadioButtons as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(getRadioButtonsCode()),
        },
    };
};

export default overrideStories;
