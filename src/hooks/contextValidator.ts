import {
    DATA_CLIENT_TOKEN,
    EMPTY_PROVIDER_CONTEXT_CLIENT_TOKEN_ERROR_MESSAGE,
} from "../constants";
import type {
    ScriptContextState,
    PayPalHostedFieldsContextState,
} from "../types";

/**
 * Check if the context is valid and ready to dispatch actions.
 *
 * @param scriptContext the result of connecting to the context provider
 * @returns strict context avoiding null values in the type
 */
export function contextNotEmptyValidator<
    Type extends ScriptContextState | PayPalHostedFieldsContextState
>(scriptContext: Type | null, executorName = "usePayPalScriptReducer"): Type {
    if (
        typeof scriptContext?.dispatch === "function" &&
        scriptContext.dispatch.length !== 0
    ) {
        return scriptContext;
    }

    throw new Error(
        `${executorName} must be used within a PayPalScriptProvider`
    );
}

/**
 * Check if the data-client-token is set in the options of the context
 * This is required to create a Braintree client
 *
 * @param scriptContext the result of connecting to the context provider
 * @returns strict context avoiding null values in the type and client token
 */
export const contextOptionClientTokenNotEmptyValidator = (
    scriptContext: ScriptContextState | null
): ScriptContextState => {
    if (!scriptContext?.options?.[DATA_CLIENT_TOKEN]) {
        throw new Error(EMPTY_PROVIDER_CONTEXT_CLIENT_TOKEN_ERROR_MESSAGE);
    }

    return scriptContext;
};
