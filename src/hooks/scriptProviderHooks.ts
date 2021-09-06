import { useContext } from "react";

import { ScriptContext } from "../context/scriptProviderContext";
import {
    contextNotEmptyValidator,
    contextOptionClientTokenNotEmptyValidator,
} from "./contextValidator";
import type {
    ScriptContextDerivedState,
    ScriptContextState,
    ScriptReducerAction,
} from "../types";
import { SCRIPT_LOADING_STATE } from "../types";

/**
 * Validate if the ScriptProvider context is valid and checks
 * if the data-client-token is not empty for specific cases
 *
 * @param context             the ScriptProvider context
 * @param validateClientToken the flag to check the data-client-token or not
 * @returns a valid ScriptProvider context
 */
const validateContext = (
    context: ScriptContextState | null,
    validateClientToken: boolean | undefined
) => {
    const notEmptyContext = contextNotEmptyValidator(context);

    return validateClientToken
        ? contextOptionClientTokenNotEmptyValidator(notEmptyContext)
        : notEmptyContext;
};

/**
 * Custom hook to get access to the Script context and
 * dispatch actions to modify the state on the {@link ScriptProvider} component
 *
 * @returns a tuple containing the state of the context and
 * a dispatch function to modify the state
 */
export function usePayPalScriptReducer(
    validateClientToken?: boolean
): [ScriptContextDerivedState, React.Dispatch<ScriptReducerAction>] {
    const scriptContext = validateContext(
        useContext(ScriptContext),
        validateClientToken
    );

    const derivedStatusContext = {
        ...scriptContext,
        isInitial: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.INITIAL,
        isPending: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.PENDING,
        isResolved:
            scriptContext.loadingStatus === SCRIPT_LOADING_STATE.RESOLVED,
        isRejected:
            scriptContext.loadingStatus === SCRIPT_LOADING_STATE.REJECTED,
    };

    return [derivedStatusContext, scriptContext.dispatch];
}
