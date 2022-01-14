import { loadCustomScript } from "@paypal/paypal-js";

import { getBraintreeWindowNamespace } from "../../utils";
import {
    BRAINTREE_SOURCE,
    BRAINTREE_PAYPAL_CHECKOUT_SOURCE,
} from "../../constants";

import type { BraintreeNamespace } from "../..";
import type { BraintreePayPalCheckout } from "./../../types/braintree/paypalCheckout";
import type { BraintreeClient } from "./../../types/braintree/clientTypes";

type WindowAMD = Window &
    typeof globalThis & {
        define: () => void;
        require: (
            dependencies: string[],
            load: (...args: unknown[]) => void,
            error: (err: Error) => void
        ) => void;
    } & { define: { amd: unknown } };

/**
 * Obtain the Braintree from the global context.
 * The scripts are injected in the page.
 * Creating a global namespace `window.braintree`.
 *
 * @since 7.5.0
 * @returns the {@link BraintreeNamespace}
 */
export const getBraintreeFromGlobalContext = (): Promise<BraintreeNamespace> =>
    Promise.all([
        loadCustomScript({ url: BRAINTREE_SOURCE }),
        loadCustomScript({ url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE }),
    ]).then(() => getBraintreeWindowNamespace());

/**
 * Obtain the Braintree using the AMD modules approach
 *
 * @since 7.5.0
 * @returns the {@link BraintreeNamespace}
 */
export const getBraintreeFromAMDModule = (): Promise<BraintreeNamespace> =>
    new Promise<BraintreeNamespace>((resolve, reject) => {
        (window as WindowAMD).require(
            [BRAINTREE_SOURCE, BRAINTREE_PAYPAL_CHECKOUT_SOURCE],
            (braintree, braintreeCheckout) =>
                resolve({
                    client: braintree as BraintreeClient,
                    paypalCheckout:
                        braintreeCheckout as BraintreePayPalCheckout,
                }),
            (err: Error) => reject(err)
        );
    });

/**
 * Get the Braintree namespace using the AMD modules or getting from global context.
 * This function enables the support for AMD modules since the Braintree scripts support it.
 *
 * Caveats:
 * - Using AMD modules can introduce problems. The Braintree defines an unnamed module,
 * meaning it can crash very easily with other [modules name](https://requirejs.org/docs/errors.html#mismatch)
 * - The Braintree AMD modules can crash if you define a global variable `define`
 * and you load your script manually not using the AMD APIs.
 *
 * @since 7.5.0
 * @returns the {@link BraintreeNamespace}
 */
export const getBraintreeLoader = (): Promise<BraintreeNamespace> => {
    return typeof (window as WindowAMD)?.define === "function" &&
        (window as WindowAMD)?.define?.amd
        ? getBraintreeFromAMDModule()
        : getBraintreeFromGlobalContext();
};
