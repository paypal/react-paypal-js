import React, { useEffect, useRef, useState } from "react";
import { usePayPalScriptReducer } from "../ScriptContext";
import type {
    PayPalButtonsComponentProps,
    PayPalButtonsComponent,
    OnInitActions
} from "@paypal/paypal-js/types/components/buttons";

interface PayPalButtonsReactProps extends PayPalButtonsComponentProps {
    /**
     * Used to re-render the component.
     * Changes to this prop will destroy the existing Buttons and render them again using the current props.
     */
    forceReRender?: unknown;
    /**
     * Pass a css class to the div container.
     */
    className?: string;
    /**
     * Disables the buttons.
     */
    disabled?: boolean;
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
export default function PayPalButtons({
    className = "",
    disabled = false,
    forceReRender,
    ...buttonProps
}: PayPalButtonsReactProps) {
    const [{ isResolved, options }] = usePayPalScriptReducer();
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const buttons = useRef<PayPalButtonsComponent | null>(null);
    const [initActions, setInitActions] = useState<OnInitActions | null>(null);

    const [, setErrorState] = useState(null);

    function closeButtonsComponent() {
        if (buttons.current !== null) {
            buttons.current.close();
        }
    }

    // useEffect hook for rendering the buttons
    useEffect(() => {
        // verify the sdk script has successfully loaded
        if (isResolved === false) {
            return closeButtonsComponent;
        }

        // verify dependency on window.paypal object
        if (
            window.paypal === undefined ||
            window.paypal.Buttons === undefined
        ) {
            setErrorState(() => {
                throw new Error(getErrorMessage(options));
            });
            return closeButtonsComponent;
        }

        const decoratedOnInit = (data: Record<string, unknown>, actions: OnInitActions) => {
            setInitActions(actions);
            if (typeof buttonProps.onInit === 'function') {
                buttonProps.onInit(data, actions);
            }
        }

        buttons.current = window.paypal.Buttons({ ...buttonProps, onInit: decoratedOnInit });

        // only render the button when eligible
        if (buttons.current.isEligible() === false) {
            return closeButtonsComponent;
        }

        if (buttonsContainerRef.current === null) {
            return closeButtonsComponent;
        }

        buttons.current.render(buttonsContainerRef.current).catch((err) => {
            // component failed to render, possibly because it was closed or destroyed.
            if (buttonsContainerRef.current === null) {
                // ref is no longer in the DOM, we can safely ignore the error
                return;
            }
            // ref is still in the DOM
            setErrorState(() => {
                throw new Error(`Failed to render <PayPalButtons /> component. ${err}`);
            });
        });

        return closeButtonsComponent;
    }, [isResolved, forceReRender, buttonProps.fundingSource]);

    // useEffect hook for managing disabled state
    useEffect(() => {
        if (initActions === null) {
            return;
        }

        if (disabled === true) {
            initActions.disable();
        } else {
            initActions.enable();
        }

    }, [disabled, initActions])

    const isDisabledStyle = disabled ? { opacity: 0.33 }: {};
    const classNames = `${className} ${disabled ? 'paypal-buttons-disabled' : ''}`.trim();


    return <div ref={buttonsContainerRef} style={isDisabledStyle} className={classNames} />;
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
