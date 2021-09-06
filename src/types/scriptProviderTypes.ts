import { HostedFieldsHandler } from "@paypal/paypal-js/types/components/hosted-fields";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { SCRIPT_ID } from "../constants";
import { BraintreePayPalCheckout } from "./braintree/paypalCheckout";
import { DISPATCH_ACTION, SCRIPT_LOADING_STATE } from "./enums";

export interface ReactPayPalScriptOptions extends PayPalScriptOptions {
    [SCRIPT_ID]: string;
}

export type ScriptReducerAction =
    | {
          type: `${DISPATCH_ACTION.LOADING_STATUS}`;
          value: SCRIPT_LOADING_STATE;
      }
    | {
          type: `${DISPATCH_ACTION.RESET_OPTIONS}`;
          value: PayPalScriptOptions | ReactPayPalScriptOptions;
      }
    | {
          type: `${DISPATCH_ACTION.SET_BRAINTREE_INSTANCE}`;
          value: BraintreePayPalCheckout;
      }
    | {
          type: `${DISPATCH_ACTION.SET_HOSTED_FIELDS_INSTANCE}`;
          value: HostedFieldsHandler;
      };

export type InitialState = {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE.INITIAL | SCRIPT_LOADING_STATE.PENDING;
};

export interface ScriptContextState {
    options: ReactPayPalScriptOptions;
    loadingStatus: SCRIPT_LOADING_STATE;
    braintreePayPalCheckoutInstance?: BraintreePayPalCheckout;
    hostedFields?: unknown;
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
