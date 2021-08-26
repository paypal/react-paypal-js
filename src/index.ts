export * from "./types/braintree/clientTypes";
export * from "./types/braintree/commonsTypes";
export * from "./types/braintree/paypalCheckout";
export * from "./types/braintreePayPalButtonTypes";
export * from "./types/enums";
export * from "./types/paypalButtonTypes";
export * from "./context/scriptProviderContext";
export * from "./hooks/scriptProviderHooks";
export * from "./components/PayPalButtons";
export * from "./components/braintree/BraintreePayPalButtons";
export * from "./components/PayPalMarks";
export * from "./components/PayPalMessages";
export * from "./components/PayPalScriptProvider";

import * as constants from "@paypal/sdk-constants/dist/module";

// We do not re-export `FUNDING` from the `sdk-constants` module
// directly because it has no type definitions.
//
// See https://github.com/paypal/react-paypal-js/issues/125
export const FUNDING: Record<string, string> = constants.FUNDING;
