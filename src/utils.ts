import type { PayPalNamespace } from "@paypal/paypal-js";
import type { BraintreeNamespace } from "./types/braintreePayPalButtonTypes";

import {
    DEFAULT_PAYPAL_NAMESPACE,
    DEFAULT_BRAINTREE_NAMESPACE,
} from "./constants";

export const isUndefined = (value: unknown): boolean => value === undefined;

export const undefinedArgumentErrorMessage = (functionName: string): string =>
    `Argument cannot be undefined calling ${functionName} function`;

export function getPayPalWindowNamespace(
    namespace: string = DEFAULT_PAYPAL_NAMESPACE
): PayPalNamespace {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)[namespace];
}

export function getBraintreeWindowNamespace(
    namespace: string = DEFAULT_BRAINTREE_NAMESPACE
): BraintreeNamespace {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any)[namespace];
}

/**
 * Creates a numeric hash based on the string input.
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
