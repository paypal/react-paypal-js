import { createContext } from "react";
//Internal dependencies
import {
    ScriptContextState,
    ReactPayPalScriptOptions,
    ScriptReducerAction,
    DISPATCH_ACTION,
    SCRIPT_LOADING_STATE,
} from "../types/ScriptProvider";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { hashStr } from "../components/utils";

// Common reference to the script identifier
const SCRIPT_ID = "data-react-paypal-script-id";

/**
 * Generate a new random identifier for react-paypal-js
 *
 * @returns the {@code string} containing the random library name
 */
export function getNewScriptID(): string {
    return `react-paypal-js-${Math.random().toString(36).substring(7)}`;
}

export function getScriptID(options: PayPalScriptOptions): string {
    return `react-paypal-js-${hashStr(JSON.stringify(options))}`;
}

/**
 * Destroy the PayPal SDK from the document page
 *
 * @param reactPayPalScriptID the script identifier
 */
export function destroySDKScript(reactPayPalScriptID: string): void {
    const scriptNode = self.document.querySelector<HTMLScriptElement>(
        `script[${SCRIPT_ID}="${reactPayPalScriptID}"]`
    );

    if (scriptNode != null && scriptNode.parentNode)
        scriptNode.parentNode.removeChild(scriptNode);
}

/**
 * Reducer function to handle complex state changes on the context
 *
 * @param state  the current state on the context object
 * @param action the action to be executed on the previous state
 * @returns a the same state if the action wasn't found, or a new state otherwise
 */
export function scriptReducer(
    state: ScriptContextState,
    action: ScriptReducerAction
): ScriptContextState {
    switch (action.type) {
        case DISPATCH_ACTION.LOADING:
            return {
                ...state,
                loadingStatus: action.value as SCRIPT_LOADING_STATE,
            };
        case DISPATCH_ACTION.RESET:
            // destroy existing script to make sure only one script loads at a time
            destroySDKScript(state.options[SCRIPT_ID]);
            return {
                ...state,
                loadingStatus: SCRIPT_LOADING_STATE.PENDING,
                options: {
                    ...(action.value as ReactPayPalScriptOptions),
                    [SCRIPT_ID]: `${getNewScriptID()}`,
                },
            };

        default: {
            return state;
        }
    }
}

// Create the React context for component tree
export const ScriptContext = createContext<ScriptContextState | undefined>(
    undefined
);
