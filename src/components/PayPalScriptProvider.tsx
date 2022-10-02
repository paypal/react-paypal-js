import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { loadScript } from "@paypal/paypal-js";

import {
    getScriptID,
    ScriptContext,
    scriptReducer,
} from "../context/scriptProviderContext";
import { SCRIPT_ID, SDK_SETTINGS, LOAD_SCRIPT_ERROR } from "../constants";
import {
    SCRIPT_LOADING_STATE,
    DISPATCH_ACTION,
    ReactPayPalScriptOptions,
    ScriptContextState,
} from "../types";
import { shallowCompareObjects } from "../utils";

import type { FC } from "react";
import type { ScriptProviderProps } from "../types";

/**
This `<PayPalScriptProvider />` component takes care of loading the JS SDK `<script>`.
It manages state for script loading so children components like `<PayPalButtons />` know when it's safe to use the `window.paypal` global namespace.

Note: You always should use this component as a wrapper for  `PayPalButtons`, `PayPalMarks`, `PayPalMessages` and `BraintreePayPalButtons` components.
 */
export const PayPalScriptProvider: FC<ScriptProviderProps> = ({
    options = { "client-id": "test" },
    children,
    deferLoading = false,
}: ScriptProviderProps) => {
    const [state, dispatch] = useReducer(scriptReducer, {
        options: {
            ...options,
            [SCRIPT_ID]: `${getScriptID(options)}`,
            [SDK_SETTINGS.DATA_SDK_INTEGRATION_SOURCE]:
                SDK_SETTINGS.DATA_SDK_INTEGRATION_SOURCE_VALUE,
        },
        loadingStatus: deferLoading
            ? SCRIPT_LOADING_STATE.INITIAL
            : SCRIPT_LOADING_STATE.PENDING,
    });

    const stateOptionsRef = useRef<ReactPayPalScriptOptions>();

    /**
    This memoization is used to avoid re-rendering the children components when the state changes.
    The state reference changes when the loading status changes, but the children components don't need to re-render when there is no change in state value.
     */
    const memoizedStateOptions = useMemo<ReactPayPalScriptOptions>(() => {
        if (
            stateOptionsRef.current !== undefined &&
            shallowCompareObjects(stateOptionsRef.current, state.options)
        ) {
            return stateOptionsRef.current;
        }
        stateOptionsRef.current = state.options;
        return state.options;
    }, [state.options]);

    useEffect(() => {
        if (
            deferLoading === false &&
            state.loadingStatus === SCRIPT_LOADING_STATE.INITIAL
        ) {
            return dispatch({
                type: DISPATCH_ACTION.LOADING_STATUS,
                value: SCRIPT_LOADING_STATE.PENDING,
            });
        }

        if (state.loadingStatus !== SCRIPT_LOADING_STATE.PENDING) {
            return;
        }

        let isSubscribed = true;

        loadScript(memoizedStateOptions)
            .then(() => {
                if (isSubscribed) {
                    dispatch({
                        type: DISPATCH_ACTION.LOADING_STATUS,
                        value: SCRIPT_LOADING_STATE.RESOLVED,
                    });
                }
            })
            .catch((err) => {
                console.error(`${LOAD_SCRIPT_ERROR} ${err}`);
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
    }, [deferLoading, memoizedStateOptions, state.loadingStatus]);

    const contextValue = useMemo<ScriptContextState>(
        () => ({
            options: memoizedStateOptions,
            loadingStatus: state.loadingStatus,
            braintreePayPalCheckoutInstance:
                state.braintreePayPalCheckoutInstance,
            dispatch,
        }),
        [
            memoizedStateOptions,
            state.loadingStatus,
            state.braintreePayPalCheckoutInstance,
        ]
    );

    return (
        <ScriptContext.Provider value={contextValue}>
            {children}
        </ScriptContext.Provider>
    );
};
