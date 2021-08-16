import {
    DEFAULT_PAYPAL_NAMESPACE,
    DEFAULT_BRAINTREE_NAMESPACE,
} from "./constants";
import type { PayPalNamespace } from "@paypal/paypal-js";
import type { BraintreeNamespace } from "./types/braintreePayPalButtonTypes";

/**
 * Get the namespace from the window in the browser
 * this is useful to get the paypal object from window
 * after load PayPal SDK script
 *
 * @param namespace the name space to return
 * @returns the namespace if exists or undefined otherwise
 */
export function getPayPalWindowNamespace(
    namespace: string = DEFAULT_PAYPAL_NAMESPACE
): PayPalNamespace {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)[namespace];
}

/**
 * Get a namespace from the window in the browser
 * this is useful to get the braintree from window
 * after load Braintree script
 *
 * @param namespace the name space to return
 * @returns the namespace if exists or undefined otherwise
 */
export function getBraintreeWindowNamespace(
    namespace: string = DEFAULT_BRAINTREE_NAMESPACE
): BraintreeNamespace {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)[namespace];
}

/**
 * Creates a numeric hash based on the string input
 *
 * @param str the source string to generate the hash
 * @returns a hash numeric ode
 */
export function hashStr(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str[i].charCodeAt(0) * Math.pow((i % 10) + 1, 5);
    }
    return Math.floor(Math.pow(Math.sqrt(hash), 5));
}
