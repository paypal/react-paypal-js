import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePayPalScriptReducer } from "../ScriptContext";
import type { PayPalMarksComponentProps } from "@paypal/paypal-js/types/components/marks";

/**
 * The `<PayPalMarks />` component is used for conditionally rendering different payment options using radio buttons.
 * The [Display PayPal Buttons with other Payment Methods guide](https://developer.paypal.com/docs/business/checkout/add-capabilities/buyer-experience/#display-paypal-buttons-with-other-payment-methods) describes this style of integration in detail.
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * ```jsx
 *     <PayPalMarks />
 * ```
 *
 * This component can also be configured to use a single funding source similar to the [standalone buttons](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/) approach.
 * A `FUNDING` object is exported by this library which has a key for every available funding source option.
 *
 * ```js
 *     import { FUNDING } from '@paypal/react-paypal-js'
 * ```
 *
 * Use this `FUNDING` constant to set the `fundingSource` prop.
 *
 * ```jsx
 *     <PayPalMarks fundingSource={FUNDING.PAYPAL}/>
 * ```
 */
export default function PayPalMarks(props: PayPalMarksComponentProps) {
    const [{ isResolved, options }] = usePayPalScriptReducer();
    const markContainerRef = useRef(null);
    const mark = useRef(null);
    const [, setErrorState] = useState(null);

    useEffect(() => {
        if (!isResolved || mark.current) {
            return;
        }

        if (!hasValidStateForMarks(options, setErrorState)) {
            return;
        }

        // @ts-expect-error - null checks
        mark.current = window.paypal.Marks({ ...props });

        // @ts-expect-error - null checks
        if (!mark.current.isEligible()) {
            return;
        }

        // @ts-expect-error - null checks
        mark.current.render(markContainerRef.current).catch((err) => {
            console.error(`Failed to render <PayPalMarks /> component. ${err}`);
        });
    }, [isResolved, props.fundingSource]);

    return <div ref={markContainerRef} />;
}

// @ts-expect-error - figure out setErrorState
function hasValidStateForMarks({ components = "" }, setErrorState) {
    // @ts-expect-error - needs null checks
    if (typeof window.paypal.Marks !== "undefined") {
        return true;
    }

    let errorMessage =
        "Unable to render <PayPalMarks /> because window.paypal.Marks is undefined.";

    // the JS SDK does not load the Marks component by default. It must be passed into the "components" query parameter.
    if (!components.includes("marks")) {
        const expectedComponents = components ? `${components},marks` : "marks";

        errorMessage +=
            "\nTo fix the issue, add 'marks' to the list of components passed to the parent PayPalScriptProvider:" +
            `\n\`<PayPalScriptProvider options={{ components: '${expectedComponents}'}}>\`.`;
    }
    setErrorState(() => {
        throw new Error(errorMessage);
    });
    return false;
}

PayPalMarks.propTypes = {
    /**
     * The individual mark to render. Use the `FUNDING` constant exported by this library to set this value.
     * View the [list of available funding sources](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/#funding-sources) for more info.
     */
    fundingSource: PropTypes.string,
};
