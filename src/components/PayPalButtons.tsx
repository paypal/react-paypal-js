import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePayPalScriptReducer } from "../ScriptContext";
import type { PayPalButtonsComponentProps, PayPalButtonsComponent } from "@paypal/paypal-js/types/components/buttons";

interface PayPalButtonsReactProps extends PayPalButtonsComponentProps {
    forceReRender?: unknown
}
/**
 * This `<PayPalButtons />` component renders the [Smart Payment Buttons](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/#buttons).
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * Use props for customizing your buttons. For example, here's how you would use the `style` and `createOrder` options:
 *
 * ```jsx
 *     <PayPalButtons style={{ layout: "vertical" }} createOrder={(data, actions) => {}} />
 * ```
 */
export default function PayPalButtons(props: PayPalButtonsReactProps) {
    const [{ isResolved, options }] = usePayPalScriptReducer();
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const buttons = useRef<PayPalButtonsComponent | null>(null);
    const [, setErrorState] = useState(null);

    useEffect(() => {
        const cleanup = () => {
            buttons?.current?.close();
        };

        // verify the sdk script has successfully loaded
        if (isResolved === false) {
            return cleanup;
        }

        // verify global state on window object
        if (window.paypal === undefined || window.paypal.Buttons === undefined) {
            setErrorState(() => {
                throw new Error(getErrorMessage(options));
            });
            return cleanup;
        }

        buttons.current = window.paypal.Buttons({ ...props });

        // only render the button when it's eligible
        if (buttons.current.isEligible() === false) {
            return cleanup;
        }

        if (buttonsContainerRef.current === null) {
            return cleanup;
        }

        buttons.current.render(buttonsContainerRef.current).catch((err) => {
            console.error(
                `Failed to render <PayPalButtons /> component. ${err}`
            );
        });

        return cleanup;
    }, [isResolved, props.forceReRender, props.fundingSource]);

    return <div ref={buttonsContainerRef} />;
}

function getErrorMessage({ components = "" }) {
    let errorMessage =
    "Unable to render <PayPalButtons /> because window.paypal.Buttons is undefined.";

    // the JS SDK includes the Buttons component by default when no 'components' are specified.
    // The 'buttons' component must be included in the 'components' list when using it with other components.
    if (components.length && !components.includes("buttons")) {
        const expectedComponents = `${components},buttons`;

        errorMessage +=
            "\nTo fix the issue, add 'buttons' to the list of components passed to the parent PayPalScriptProvider:" +
            `\n\`<PayPalScriptProvider options={{ components: '${expectedComponents}'}}>\`.`;
    }

    return errorMessage;
}

// @ts-expect-error - figure out setErrorState
function hasValidGlobalStateForButtons({ components = "" }, setErrorState) {
    // @ts-expect-error - needs null checks
    if (typeof window.paypal.Buttons !== "undefined") {
        return true;
    }

    let errorMessage =
        "Unable to render <PayPalButtons /> because window.paypal.Buttons is undefined.";

    // the JS SDK includes the Buttons component by default when no 'components' are specified.
    // The 'buttons' component must be included in the 'components' list when using it with other components.
    if (components.length && !components.includes("buttons")) {
        const expectedComponents = `${components},buttons`;

        errorMessage +=
            "\nTo fix the issue, add 'buttons' to the list of components passed to the parent PayPalScriptProvider:" +
            `\n\`<PayPalScriptProvider options={{ components: '${expectedComponents}'}}>\`.`;
    }
    setErrorState(() => {
        throw new Error(errorMessage);
    });
    return false;
}

PayPalButtons.propTypes = {
    /**
     * Sets up the transaction. Called when the buyer clicks the PayPal button.
     */
    createOrder: PropTypes.func,
    /**
     * Deprecated, replaced by `createSubscription`.
     */
    createBillingAgreement: PropTypes.func,
    /**
     * Sets up a subscription. Called when the buyer clicks the PayPal button.
     */
    createSubscription: PropTypes.func,
    /**
     * The individual button to render. Use the `FUNDING` constant exported by this library to set this value.
     * View the [list of available funding sources](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/#funding-sources) for more info.
     */
    fundingSource: PropTypes.string,

    /**
     * [Styling options](https://developer.paypal.com/docs/business/checkout/reference/style-guide/#customize-the-payment-buttons) for customizing layout, color, shape, and labels.
     */
    style: PropTypes.exact({
        color: PropTypes.string,
        height: PropTypes.number,
        label: PropTypes.string,
        layout: PropTypes.string,
        shape: PropTypes.string,
        tagline: PropTypes.bool,
    }),
    /**
     * Finalizes the transaction. Often used to show the buyer a [confirmation page](https://developer.paypal.com/docs/checkout/integration-features/confirmation-page/).
     */
    onApprove: PropTypes.func,
    /**
     * Called when the buyer cancels the transaction.
     * Often used to show the buyer a [cancellation page](https://developer.paypal.com/docs/business/checkout/add-capabilities/buyer-experience/#show-a-cancellation-page).
     */
    onCancel: PropTypes.func,
    /**
     * Called when the button is clicked. Often used for [validation](https://developer.paypal.com/docs/checkout/integration-features/validation/).
     */
    onClick: PropTypes.func,
    /**
     * Catch all for errors preventing buyer checkout.
     * Often used to show the buyer an [error page](https://developer.paypal.com/docs/checkout/integration-features/handle-errors/).
     */
    onError: PropTypes.func,
    /**
     * Called when the button first renders.
     */
    onInit: PropTypes.func,
    /**
     * Called when the buyer changes their shipping address on PayPal.
     */
    onShippingChange: PropTypes.func,
    /**
     * Used to re-render the component. Changes to this prop will destroy
     * the existing Buttons and render them again using the current props.
     */
    forceReRender: PropTypes.any,
};

PayPalButtons.defaultProps = {
    style: {},
};
