import type { Story } from "@storybook/react";

import { Default } from "./VenmoButton.stories";
import { generateDocPageStructure } from "../commons";

const getDefaultCode = (): string =>
    `import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Custom error component
const InEligibleError: FC<{ text?: string }> = ({ text }) => (
	<h3 style={{ color: "#dc3545", textTransform: "capitalize" }}>
		{text || "The component is ineligible to render"}
	</h3>
);

export default function App() {
	return (
		<PayPalScriptProvider
			options={{
				"client-id":
					"AdLzRW18VHoABXiBhpX2gf0qhXwiW4MmFVHL69V90vciCg_iBLGyJhlf7EuWtFcdNjGiDfrwe7rmhvMZ",
				components: "buttons,funding-eligibility",
				"enable-funding": "venmo",
			}}
		>
			<PayPalButtons
				fundingSource="venmo"
				style={{
					color: "blue",
				}}
			>
				<InEligibleError text="You are not eligible to pay with Venmo." />
			</PayPalButtons>
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
