export * from "./types/ScriptProvider";
export * from "./context/ScriptProvider";
export * from "./hooks/ScriptProvider";
export * from "./components/PayPalButtons";
export * from "./components/PayPalMarks";
export * from "./components/PayPalMessages";
export * from "./components/PayPalScriptProvider";

import * as constants from "@paypal/sdk-constants/dist/module";

// We do not re-export `FUNDING` from the `sdk-constants` module
// directly because it has no type definitions.
//
// See https://github.com/paypal/react-paypal-js/issues/125
export const FUNDING: Record<string, string> = constants.FUNDING;
