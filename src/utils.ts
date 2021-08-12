import { DEFAULT_PAYPAL_NAMESPACE } from "./constants";
import type { PayPalNamespace } from "@paypal/paypal-js";
import type { BraintreeNamespace } from "./types/braintreePayPalButtonTypes";

/**
 * Commons function to check is a value is strict undefined
 * Useful to avoid repeating same code in multiple places and
 * avoid using libraries such as lodash
 *
 * @param value
 * @returns
 */
export const isUndefined = (value: unknown): boolean => value === undefined;

/**
 * Wrapper function to return same message in any call only modifying the
 * name of the called function
 *
 * @param functionName
 * @returns
 */
export const undefinedArgumentErrorMessage = (functionName: string): string =>
    `Argument cannot be undefined calling ${functionName} function`;

/**
 * Get a namespace from the window in the browser
 * This is useful to get the paypal or braintree from window
 * after load PayPal SDK or Braintree scripts
 * If the namespace is not defined will try to return paypal from window
 *
 * @param namespace the name space to return
 * @returns the namespace if exists or undefined otherwise
 */
export function getNamespace<Type extends PayPalNamespace | BraintreeNamespace>(
    namespace: string = DEFAULT_PAYPAL_NAMESPACE
): Type {
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
    if (isUndefined(str))
        throw new Error(undefinedArgumentErrorMessage("hashStr"));

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str[i].charCodeAt(0) * Math.pow((i % 10) + 1, 5);
    }
    return Math.floor(Math.pow(Math.sqrt(hash), 5));
}
