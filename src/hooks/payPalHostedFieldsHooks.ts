import { useContext } from "react";

import { PayPalHostedFieldsContext } from "../context/payPalHostedFieldsContext";
import { contextNotEmptyValidator } from "./contextValidator";
import type {
    PayPalHostedFieldsContextState,
    PayPalHostedFieldsAction,
} from "../types/payPalHostedFieldTypes";
import type { HostedFieldsHandler } from "@paypal/paypal-js/types/components/hosted-fields";

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

    return [
        payPalHostedFieldsContext,
        payPalHostedFieldsContext.dispatch as React.Dispatch<PayPalHostedFieldsAction>,
    ];
}

export function usePayPalHostedFields(): HostedFieldsHandler | undefined {
    const [payPalHostedFieldsContext] = usePayPalHostedFieldsContext();

    return payPalHostedFieldsContext.cardFields;
}
