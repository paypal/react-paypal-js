import React, { FC, ReactElement } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";

import { getOptionsFromQueryString } from "./utils";
import {
    PayPalScriptProvider,
    DISPATCH_ACTION,
    SCRIPT_LOADING_STATE,
} from "../index";
import {
    getScriptID,
    destroySDKScript,
} from "../context/scriptProviderContext";
import { usePayPalScriptReducer } from "../hooks/scriptProviderHooks";
import { generateDocPageStructure } from "./commons";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    ...getOptionsFromQueryString(),
};

const LoadScriptButton: FC = () => {
    const [{ isResolved }, dispatch] = usePayPalScriptReducer();

    return (
        <div style={{ display: "inline-flex" }}>
            <button
                type="button"
                style={{ display: "block", marginBottom: "20px" }}
                disabled={isResolved}
                onClick={() => {
                    dispatch({
                        type: DISPATCH_ACTION.LOADING_STATUS,
                        value: SCRIPT_LOADING_STATE.PENDING,
                    });
                }}
            >
                Load PayPal script
            </button>
            <button
                type="button"
                style={{
                    display: "block",
                    marginBottom: "20px",
                    marginLeft: "1em",
                }}
                onClick={() => {
                    destroySDKScript(getScriptID(scriptProviderOptions));
                    dispatch({
                        type: DISPATCH_ACTION.LOADING_STATUS,
                        value: SCRIPT_LOADING_STATE.INITIAL,
                    });
                }}
            >
                Reset
            </button>
        </div>
    );
};

function PrintLoadingState(): ReactElement | null {
    const [{ isInitial, isPending, isResolved, isRejected }] =
        usePayPalScriptReducer();

    if (isInitial) {
        action("isInitial")(
            "The sdk script has not been loaded  yet. It has been deferred."
        );
    } else if (isPending) {
        action("isPending")("The sdk script is loading.");
    } else if (isResolved) {
        action("isResolved")("The sdk script has successfully loaded.");
    } else if (isRejected) {
        action("isResolved")(
            "Something went wrong. The sdk script failed to load."
        );
    }

    return null;
}

export default {
    title: "PayPal/PayPalScriptProvider",
    component: PayPalScriptProvider,
    parameters: {
        controls: { expanded: true },
    },
    argTypes: {
        deferLoading: {
            options: [true, false],
            control: {
                type: "select",
            },
            description:
                "Allow to defer the loading of the PayPal script. If the value is `true` you'll need to load manually.",
            table: { category: "Props" },
        },
        options: {
            control: { disable: true },
            table: { category: "Props" },
        },
    },
    args: {
        deferLoading: false,
    },
};

export const Default: FC<{ deferLoading: boolean }> = ({ deferLoading }) => {
    return (
        <PayPalScriptProvider
            options={scriptProviderOptions}
            deferLoading={deferLoading}
        >
            <LoadScriptButton />
            <PrintLoadingState />
            {/* add your paypal components here (ex: <PayPalButtons />) */}
        </PayPalScriptProvider>
    );
};

const getDefaultCode = (): string =>
    `import {
	PayPalScriptProvider,
	usePayPalScriptReducer,
	getScriptID,
	destroySDKScript,
} from "@paypal/react-paypal-js";

const SCRIPT_PROVIDER_OPTIONS = {
	"client-id": "test",
};

// Custom loader component
const LoadScriptButton = () => {
	const [{ isResolved }, dispatch] = usePayPalScriptReducer();

	return (
		<div style={{ display: "inline-flex" }}>
			<button
				type="button"
				style={{ display: "block", marginBottom: "20px" }}
				disabled={isResolved}
				onClick={() => {
					dispatch({
						type: "setLoadingStatus",
						value: "pending",
					});
				}}
			>
				Load PayPal script
			</button>
			<button
				type="button"
				style={{
					display: "block",
					marginBottom: "20px",
					marginLeft: "1em",
				}}
				onClick={() => {
					destroySDKScript(getScriptID(SCRIPT_PROVIDER_OPTIONS));
					dispatch({
						type: "setLoadingStatus",
						value: "initial",
					});
				}}
			>
				Reset
			</button>
		</div>
	);
};

// Show state
function PrintLoadingState() {
    const [{ isInitial, isPending, isResolved, isRejected }] =
        usePayPalScriptReducer();
    let status = "no status";

	if (isInitial) {
		status = "initial";
	} else if (isPending) {
		status = "pending";
	} else if (isResolved) {
		status = "resolved";
	} else if (isRejected) {
		status = "rejected";
	}

	return (<div>Current status: { status }</div>);
}

export default function App() {
	return (
		<PayPalScriptProvider
			options={SCRIPT_PROVIDER_OPTIONS}
			deferLoading={true}
		>
			<LoadScriptButton />
			<PrintLoadingState />
			{/* add your paypal components here (ex: <PayPalButtons />) */}
		</PayPalScriptProvider>
	);
}
`;

(Default as Story).parameters = {
    docs: {
        page: () => generateDocPageStructure(getDefaultCode()),
    },
};
