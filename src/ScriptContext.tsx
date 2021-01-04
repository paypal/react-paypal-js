import React, { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { loadScript } from "@paypal/paypal-js";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

enum SCRIPT_LOADING_STATE {
    PENDING = "pending",
    REJECTED = "rejected",
    RESOLVED = "resolved",
}

interface ScriptContextState {
    options: PayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE;
}

interface ScriptDispatchState {
    options: PayPalScriptOptions;
    isPending: boolean;
    isRejected: boolean;
    isResolved: boolean;
}

const ScriptContext = createContext<ScriptContextState | null>(null);
const ScriptDispatchContext = createContext<ScriptDispatchState | null>(null);

// const ScriptContext = createContext({ options: {}, loadingStatus: SCRIPT_LOADING_STATE.PENDING });
// const ScriptDispatchContext = createContext({
//     options: {},
//     isPending: true,
//     isRejected: false,
//     isResolved: false,
// });

interface ScriptReducerActions {
    type: "setLoadingStatus" | "resetOptions";
    value: SCRIPT_LOADING_STATE | PayPalScriptOptions;
}

function scriptReducer(state: ScriptContextState, action: ScriptReducerActions): ScriptContextState {
    switch (action.type) {
        case "setLoadingStatus":
            const loadingStatus = action.value as SCRIPT_LOADING_STATE;
            return {
                options: {
                    ...state.options,
                },
                loadingStatus
            };
        case "resetOptions":
            const options = action.value as PayPalScriptOptions;
            return {
                loadingStatus: SCRIPT_LOADING_STATE.PENDING,
                options
            };

        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function usePayPalScriptReducer() {
    const scriptContext = useContext(ScriptContext);
    const dispatchContext = useContext(ScriptDispatchContext);
    if (scriptContext === null || dispatchContext === null) {
        throw new Error(
            "useScriptReducer must be used within a ScriptProvider"
        );
    }

    const { loadingStatus, ...restScriptContext } = scriptContext;

    const derivedStatusContext = {
        ...restScriptContext,
        isPending: loadingStatus === SCRIPT_LOADING_STATE.PENDING,
        isResolved: loadingStatus === SCRIPT_LOADING_STATE.RESOLVED,
        isRejected: loadingStatus === SCRIPT_LOADING_STATE.REJECTED,
    };

    return [derivedStatusContext, dispatchContext];
}

interface ScriptProviderProps {
    options: PayPalScriptOptions;
    children?: React.ReactNode;
}

function PayPalScriptProvider({ options, children }: ScriptProviderProps) {
    const initialState = {
        options,
        loadingStatus: SCRIPT_LOADING_STATE.PENDING,
    };

    const [state, dispatch] = useReducer(scriptReducer, initialState);

    useEffect(() => {
        if (state.loadingStatus !== SCRIPT_LOADING_STATE.PENDING) return;

        let isSubscribed = true;
        loadScript(state.options)
            .then(() => {
                if (isSubscribed) {
                    dispatch({
                        type: "setLoadingStatus",
                        value: SCRIPT_LOADING_STATE.RESOLVED,
                    });
                }
            })
            .catch(() => {
                if (isSubscribed) {
                    dispatch({
                        type: "setLoadingStatus",
                        value: SCRIPT_LOADING_STATE.REJECTED,
                    });
                }
            });
        return () => {
            isSubscribed = false;
        };
    });

    return (
        <ScriptContext.Provider value={state}>
            {/* @ts-expect-error - still need to create types for context */}
            <ScriptDispatchContext.Provider value={dispatch}>
                {children}
            </ScriptDispatchContext.Provider>
        </ScriptContext.Provider>
    );
}

PayPalScriptProvider.propTypes = {
    children: PropTypes.node.isRequired,
    options: PropTypes.exact({
        "buyer-country": PropTypes.string,
        "client-id": PropTypes.string.isRequired,
        commit: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        components: PropTypes.string,
        currency: PropTypes.string,
        "data-client-token": PropTypes.string,
        "data-csp-nonce": PropTypes.string,
        "data-order-id": PropTypes.string,
        "data-page-type": PropTypes.string,
        "data-partner-attribution-id": PropTypes.string,
        debug: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        "disable-funding": PropTypes.string,
        "integration-date": PropTypes.string,
        intent: PropTypes.string,
        locale: PropTypes.string,
        "merchant-id": PropTypes.string,
        vault: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    }),
};

export { PayPalScriptProvider, usePayPalScriptReducer };
