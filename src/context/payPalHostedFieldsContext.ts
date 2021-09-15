import { createContext } from "react";

import { HOSTED_FIELDS_DISPATCH_ACTION } from "../types/enums";
import type {
    PayPalHostedFieldsContextState,
    PayPalHostedFieldsAction,
} from "../types/payPalHostedFieldTypes";

/**
 * Reducer function to handle state related to PayPal hosted fields
 *
 * @param state  the current state on the context object
 * @param action the action to be executed on the previous state
 * @returns a the same state if the action wasn't found, or a new state otherwise
 */
export function payPalHostedFieldsReducer(
    state: PayPalHostedFieldsContextState,
    action: PayPalHostedFieldsAction
): PayPalHostedFieldsContextState {
    switch (action.type) {
        case HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS:
            return {
                ...state,
                cardFields: action.value,
            };

        default: {
            return state;
        }
    }
}

// Create the React context to use in the script provider component
export const PayPalHostedFieldsContext =
    createContext<PayPalHostedFieldsContextState | null>(null);
