import React, { useEffect, useRef, useState } from "react";

import { usePayPalScriptReducer } from "../hooks/scriptProviderHooks";
import { getPayPalWindowNamespace, generateErrorMessage } from "../utils";
import { SDK_SETTINGS } from "../constants";

import type { FunctionComponent } from "react";
import type {
    PayPalHostedButtonsComponent,
    PayPalHostedButtonsComponentOptions,
} from "@paypal/paypal-js";

/**
This `<PayPalHostedButtons />` component supports rendering [buttons](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/#buttons) for PayPal, Venmo, and alternative payment methods.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
*/
export const PayPalHostedButtons: FunctionComponent<
    PayPalHostedButtonsComponentOptions
> = ({ ...buttonProps }: PayPalHostedButtonsComponentOptions) => {
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const buttons = useRef<PayPalHostedButtonsComponent | null>(null);

    const [{ isResolved, options }] = usePayPalScriptReducer();
    const [, setErrorState] = useState(null);

    // useEffect hook for rendering the buttons
    useEffect(() => {
        // verify the sdk script has successfully loaded
        if (isResolved === false) {
            return;
        }

        const paypalWindowNamespace = getPayPalWindowNamespace(
            options.dataNamespace
        );

        // verify dependency on window object
        if (
            paypalWindowNamespace === undefined ||
            paypalWindowNamespace.HostedButtons === undefined
        ) {
            setErrorState(() => {
                throw new Error(
                    generateErrorMessage({
                        reactComponentName:
                            PayPalHostedButtons.displayName as string,
                        sdkComponentKey: "buttons",
                        sdkRequestedComponents: options.components,
                        sdkDataNamespace: options[SDK_SETTINGS.DATA_NAMESPACE],
                    })
                );
            });
            return;
        }

        try {
            buttons.current = paypalWindowNamespace.HostedButtons({
                ...buttonProps,
            });
        } catch (err) {
            return setErrorState(() => {
                throw new Error(
                    `Failed to render <PayPalHostedButtons /> component. Failed to initialize:  ${err}`
                );
            });
        }

        if (!buttonsContainerRef.current) {
            return;
        }

        buttons.current.render(buttonsContainerRef.current).catch((err) => {
            // component failed to render, possibly because it was closed or destroyed.
            if (
                buttonsContainerRef.current === null ||
                buttonsContainerRef.current.children.length === 0
            ) {
                // paypal buttons container is no longer in the DOM, we can safely ignore the error
                return;
            }
            // paypal buttons container is still in the DOM
            setErrorState(() => {
                throw new Error(
                    `Failed to render <PayPalHostedButtons /> component. ${err}`
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isResolved]);

    return <div ref={buttonsContainerRef} />;
};

PayPalHostedButtons.displayName = "PayPalHostedButtons";
