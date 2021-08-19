import React, { useState, useEffect, ReactElement } from "react";
import type { FC } from "react";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type {
    CreateBraintreeActions,
    OnApproveBraintreeActions,
} from "../types/braintreePayPalButtonTypes";
import type { BraintreePayPalCheckoutTokenizationOptions } from "../types/braintree/paypalCheckout";
import { OnApproveData } from "../types/braintreePayPalButtonTypes";
import { PayPalScriptProvider } from "../index";
import { BraintreePayPalButtons } from "../components/braintree/BraintreePayPalButtons";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
    approveSale,
} from "./utils";

const AMOUNT = "10.0";
const EMPTY = "EMPTY";
const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

const setResultText = (value: string) => {
    const elem = window.document.getElementById("result");

    if (elem != null) elem.innerHTML = value;
};

/**
 * Function to handle the createOrder/createPayment
 * when a user click in a PayPal button
 *
 * @param _       the data received from the SDK callback
 * @param actions the actions object modified with the braintree instance
 * @returns the payment promise
 */
const createOrder = (
    _: Record<string, unknown>,
    actions: CreateBraintreeActions
) =>
    actions.braintree.createPayment({
        flow: "checkout",
        amount: AMOUNT,
        currency: "USD",
        intent: "capture",
        enableShippingAddress: true,
        shippingAddressEditable: false,
        shippingAddressOverride: {
            recipientName: "Scruff McGruff",
            line1: "1234 Main St.",
            line2: "Unit 1",
            city: "Chicago",
            countryCode: "US",
            postalCode: "60652",
            state: "IL",
            phone: "123.456.7890",
        },
    });

/**
 * Function to handle the approve flow after a user login in PayPal
 * and proceed approving the payment
 *
 * @param data    the data received from the SDK callback
 * @param actions the actions object modified with the braintree instance
 * @returns the approve promise
 */
const onApprove = (data: OnApproveData, actions: OnApproveBraintreeActions) =>
    actions.braintree
        .tokenizePayment(data as BraintreePayPalCheckoutTokenizationOptions)
        .then((payload) => {
            approveSale(payload.nonce, AMOUNT).then((data) => {
                setResultText(JSON.stringify(data, null, 2));
            });
        });

export default {
    title: "Example/BraintreePayPalButtons",
    component: BraintreePayPalButtons,
    parameters: { parameters: { react: { async: true } } },
    argTypes: {
        style: { control: null },
        label: {
            description: "MI OWN DESCRIPTION",
        },
    },
    args: {
        // Storybook passes empty functions by default for props like `onShippingChange`.
        // This turns on the `onShippingChange()` feature which uses the popup experience with the Standard Card button.
        // We pass null to opt-out so the inline guest feature works as expected with the Standard Card button.
        onShippingChange: null,
    },
    decorators: [
        (Story: FC, arg: { viewMode: string }): ReactElement => {
            // Workaround to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken());
                })();
            }, []);

            return (
                <div style={{ minHeight: "200px" }}>
                    {clientToken != null && (
                        <>
                            <PayPalScriptProvider
                                options={{
                                    ...scriptProviderOptions,
                                    "data-client-token": clientToken,
                                    "data-namespace": generateRandomString(),
                                }}
                            >
                                <Story />
                            </PayPalScriptProvider>
                            {arg.viewMode === "story" && (
                                <div>
                                    <h3
                                        style={{
                                            fontFamily:
                                                "'Nunito Sans',-apple-system,'.SFNSText-Regular','San Francisco',BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif",
                                        }}
                                    >
                                        Approve response:
                                    </h3>
                                    <button
                                        title="Clear result"
                                        onClick={setResultText.bind(
                                            this,
                                            EMPTY
                                        )}
                                        style={{
                                            border: "1px solid rgba(0,0,0,.1)",
                                            borderRadius: "4px",
                                            background: "white",
                                            float: "right",
                                            cursor: "pointer",
                                            height: "22px",
                                        }}
                                    >
                                        X
                                    </button>
                                    <div
                                        style={{
                                            border: "1px solid rgba(0,0,0,.1)",
                                            lineHeight: "19px",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <pre
                                            id="result"
                                            style={{ margin: "20px" }}
                                        >
                                            {EMPTY}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        },
    ],
};

export const Default: FC = () => (
    <BraintreePayPalButtons createOrder={createOrder} onApprove={onApprove} />
);
