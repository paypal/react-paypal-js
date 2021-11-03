import { generateFundingSource } from "../utils";

import type { Args } from "@storybook/addons/dist/ts3.9/types";

const IMPORT_STATEMENT = 
`import { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";`;

const SPINNER_EFFECT =
`useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                "data-order-id": Date.now().toString(),
            },
        });
    }, [showSpinner]);
`;

const BUTTON_WRAPPER_EFFECT =
`// usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency]);
`;

export const getDefaultCode = (args: Args): string =>
`${IMPORT_STATEMENT}

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
    ${BUTTON_WRAPPER_EFFECT}
    ${SPINNER_EFFECT}

    return (<>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={${JSON.stringify(args.style)}}
                disabled={${args.disabled}}
                forceReRender={["${args.amount}", "${args.currency}", ${JSON.stringify(args.style)}]}
                ${generateFundingSource(args.fundingSource as string)}
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
                onApprove={function (data, actions) {
                    return actions.order.capture().then(function () {
                        // Your code here after capture the order
                    });
                }}
            />
        </>
    );
}

export default function App() {
	return (
		<div style={{ maxWidth: "${args.size}px", minHeight: "200px" }}>
			<PayPalScriptProvider
				options={{
					"client-id": "test",
					components: "buttons",
                    currency: "${args.currency}"
				}}
			>
				<ButtonWrapper
                    currency={"${args.currency}"}
                    showSpinner={${args.showSpinner}}
                />
			</PayPalScriptProvider>
		</div>
	);
}`;

export const getDonateCode = (args: Args): string =>
`${IMPORT_STATEMENT}

const ButtonWrapper = ({ currency }) => {
    ${BUTTON_WRAPPER_EFFECT}
 
     return (<PayPalButtons
        fundingSource="paypal"
        style={${JSON.stringify({ ...args.style as Record<string, unknown>, label: "donate" })}}
        disabled={${args.disabled}}
        createOrder={(data, actions) => {
            return actions.order
                .create({
                    purchase_units: [
                        {
                            amount: {
                                value: "${args.amount}", // Here change the amount if needed
                                breakdown: {
                                    item_total: {
                                        currency_code: "${args.currency}", // Here change the currency if needed
                                        value: "${args.amount}", // Here change the amount if needed
                                    },
                                },
                            },
                            items: [
                                {
                                    name: "donation-example",
                                    quantity: "1",
                                    unit_amount: {
                                        currency_code: "${args.currency}", // Here change the currency if needed
                                        value: "${args.amount}", // Here change the amount if needed
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
     );
} 

 export default function App() {
     return (
        <div
             style={{ maxWidth: "750px", minHeight: "200px" }}
        >
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    components: "buttons",
                }}
            >
            <ButtonWrapper
                currency={"${args.currency}"}
                showSpinner={${args.showSpinner}}
            />
            </PayPalScriptProvider>
        </div>
    );
 }`;
