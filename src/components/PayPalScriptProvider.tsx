import React from "react";
import { loadScript } from "@paypal/paypal-js";

import {
    ScriptProviderProps,
    SCRIPT_LOADING_STATE,
    DISPATCH_ACTION,
} from "../types/ScriptProvider";
import {
    getScriptID,
    ScriptContext,
    scriptReducer,
} from "../context/ScriptProvider";

export const PayPalScriptProvider: React.FC<ScriptProviderProps> = ({
    options,
    children,
    deferLoading = false,
}: ScriptProviderProps) => {
    const [state, dispatch] = React.useReducer(scriptReducer, {
        options: {
            ...options,
            "data-react-paypal-script-id": `${getScriptID(options)}`,
        },
        loadingStatus: deferLoading
            ? SCRIPT_LOADING_STATE.INITIAL
            : SCRIPT_LOADING_STATE.PENDING,
        dispatch: null,
    });

    React.useEffect(() => {
        if (
            deferLoading === false &&
            state.loadingStatus === SCRIPT_LOADING_STATE.INITIAL
        ) {
            return dispatch({
                type: DISPATCH_ACTION.LOADING_STATUS,
                value: SCRIPT_LOADING_STATE.PENDING,
            });
        }

        if (state.loadingStatus !== SCRIPT_LOADING_STATE.PENDING) return;

        let isSubscribed = true;
        loadScript(state.options)
            .then(() => {
                if (isSubscribed) {
                    dispatch({
                        type: DISPATCH_ACTION.LOADING_STATUS,
                        value: SCRIPT_LOADING_STATE.RESOLVED,
                    });
                }
            })
            .catch(() => {
                if (isSubscribed) {
                    dispatch({
                        type: DISPATCH_ACTION.LOADING_STATUS,
                        value: SCRIPT_LOADING_STATE.REJECTED,
                    });
                }
            });
        return () => {
            isSubscribed = false;
        };
    }, [options, deferLoading, state.loadingStatus]);

    return (
        <ScriptContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ScriptContext.Provider>
    );
};
