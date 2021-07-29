import React from "react";

import {
    SCRIPT_LOADING_STATE,
    ScriptContextDerivedState,
    ScriptReducerAction,
    ScriptContextState,
} from "../types/ScriptProvider";
import { ScriptContext } from "../context/ScriptProvider";

/**
 * Custom hook to get access to the Script context and
 * dispatch actions to modify the state on the {@link ScriptProvider} component
 *
 * @returns
 */
export function usePayPalScriptReducer(): [
    ScriptContextDerivedState,
    React.Dispatch<ScriptReducerAction>
] {
    const scriptContext = React.useContext(ScriptContext);
    if (scriptContext == undefined || scriptContext?.dispatch == undefined) {
        throw new Error(
            `${arguments.callee.name} must be used within a PayPalScriptProvider`
        );
    }

    const derivedStatusContext = {
        ...scriptContext!,
        isInitial:
            scriptContext!.loadingStatus === SCRIPT_LOADING_STATE.INITIAL,
        isPending:
            scriptContext!.loadingStatus === SCRIPT_LOADING_STATE.PENDING,
        isResolved:
            scriptContext!.loadingStatus === SCRIPT_LOADING_STATE.RESOLVED,
        isRejected:
            scriptContext!.loadingStatus === SCRIPT_LOADING_STATE.REJECTED,
    };

    return [derivedStatusContext, scriptContext!.dispatch!];
}
