import { useContext } from "react";

import { PayPalHostedFieldsContext } from "../context/payPalHostedFieldsContext";
import type {
    PayPalHostedFieldsContextState,
    PayPalHostedFieldsAction,
} from "../types/payPalhostedFieldTypes";
import { contextNotEmptyValidator } from "./contextValidator";

/**
 * Custom hook to get access to the PayPal Hosted Fields context
 *
 * @returns the latest state of the context
 */
export function usePayPalHostedFieldsContext(): [
    PayPalHostedFieldsContextState,
    React.Dispatch<PayPalHostedFieldsAction>
] {
    const payPalHostedFieldsContext =
        contextNotEmptyValidator<PayPalHostedFieldsContextState>(
            useContext(PayPalHostedFieldsContext),
            "usePayPalHostedFieldsContext"
        );

    return [payPalHostedFieldsContext, payPalHostedFieldsContext.dispatch];
}
