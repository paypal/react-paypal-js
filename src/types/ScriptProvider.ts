import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import React from "react";

export enum SCRIPT_LOADING_STATE {
    INITIAL = "initial",
    PENDING = "pending",
    REJECTED = "rejected",
    RESOLVED = "resolved",
}

export enum DISPATCH_ACTION {
    LOADING = "setLoadingStatus",
    RESET = "resetOptions",
}

export interface ReactPayPalScriptOptions extends PayPalScriptOptions {
    "data-react-paypal-script-id": string;
}

export interface ReactPayPalScriptOptions extends PayPalScriptOptions {
    "data-react-paypal-script-id": string;
}

export type ScriptReducerAction = {
    type: DISPATCH_ACTION;
    value:
        | SCRIPT_LOADING_STATE
        | ReactPayPalScriptOptions
        | PayPalScriptOptions;
};

export type InitialState = {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE.INITIAL | SCRIPT_LOADING_STATE.PENDING;
};

export interface ScriptContextState {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE;
    dispatch: React.Dispatch<ScriptReducerAction> | undefined;
}

export interface ScriptContextDerivedState {
    options: ReactPayPalScriptOptions;
    isInitial: boolean;
    isPending: boolean;
    isRejected: boolean;
    isResolved: boolean;
}

export interface ScriptProviderProps {
    options: PayPalScriptOptions;
    children?: React.ReactNode;
    deferLoading?: boolean;
}
