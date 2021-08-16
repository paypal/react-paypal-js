import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { SCRIPT_ID } from "../constants";
import { DISPATCH_ACTION, SCRIPT_LOADING_STATE } from "./enums";

export interface ReactPayPalScriptOptions extends PayPalScriptOptions {
    [SCRIPT_ID]: string;
}

export type ScriptReducerAction = {
    type: DISPATCH_ACTION;
    value: unknown;
};

export type InitialState = {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE.INITIAL | SCRIPT_LOADING_STATE.PENDING;
};

export interface ScriptContextState {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE;
    braintreePayPalCheckoutInstance?: unknown;
    dispatch: React.Dispatch<ScriptReducerAction> | null;
}

export interface StrictScriptContextState extends ScriptContextState {
    dispatch: React.Dispatch<ScriptReducerAction>;
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
