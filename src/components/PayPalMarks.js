import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useScriptReducer } from "../ScriptContext";
/**
 * The `<PayPalMarks />` component renders all marks for an eligible payment method.
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * ```jsx
 *     <PayPalMarks />
 * ```
 *
 * It can also be configured as a [standalone buttons](https://developer.paypal.com/docs/checkout/integration-features/standalone-buttons/) using props with the `fundingSource` option.
 *
 * ```jsx
 *     <PayPalMarks fundingSource="paypal"/>
 * ```
 */
export default function Marks({ fundingSource }) {
    const [{ isLoaded }] = useScriptReducer();
    const markContainerRef = useRef(null);
    const mark = useRef(null);

    useEffect(() => {
        if (isLoaded && !mark.current) {
            mark.current = window.paypal.Marks({
                fundingSource: fundingSource,
            });
            const isEligible = mark.current.isEligible();

            if (isEligible) {
                mark.current.render(markContainerRef.current);
            }
        }
    });

    return <div ref={markContainerRef} />;
}

Marks.propTypes = {
    /**
     * The individual mark to render. The full list can be found [here](https://developer.paypal.com/docs/checkout/integration-features/standalone-buttons/#complete-your-integration).
     */
    fundingSource: PropTypes.string,
};
