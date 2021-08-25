import React, { useState, useEffect, ReactElement } from "react";
import type { FC } from "react";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { action } from "@storybook/addon-actions";
import type {
    CreateBraintreeActions,
    OnApproveBraintreeActions,
} from "../types/braintreePayPalButtonTypes";
import type { BraintreePayPalCheckoutTokenizationOptions } from "../types/braintree/paypalCheckout";
import { OnApproveData } from "../types/braintreePayPalButtonTypes";
import { PayPalScriptProvider, FUNDING } from "../index";
import { BraintreePayPalButtons } from "../components/braintree/BraintreePayPalButtons";
import {
    getOptionsFromQueryString,
    generateRandomString,
    getClientToken,
    approveSale,
} from "./utils";
import { COMPONENT_PROPS, COMPONENT_EVENTS } from "./constants";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

export default {
    title: "Braintree/BraintreePayPalButtons",
    component: BraintreePayPalButtons,
    parameters: {
        controls: { expanded: true, sort: "requiredFirst" },
        docs: { source: { type: "code" } },
    },
    argTypes: {
        amount: {
            description:
                "This is not a property from PayPalButtons. It is custom control for testing the amount sent in the createOrder process",
            options: ["2.00", "30.00", "100.00"],
            control: {
                type: "select",
            },
            defaultValue: "2.00",
            table: {
                defaultValue: {
                    summary: "2.00",
                },
                category: "Custom",
            },
        },
        size: {
            name: "container size",
            description:
                "This is not a property from PayPalButtons. It is custom control to change the size of the PayPal buttons container",
            control: { type: "range", min: 20, max: 100, step: 5 },
            defaultValue: 100,
            table: {
                defaultValue: {
                    summary: "100%",
                },
                category: "Custom",
            },
        },
        style: {
            control: { type: "object", expanded: true },
            defaultValue: {
                color: "gold",
                label: "paypal",
                layout: "vertical",
            },
            table: { category: COMPONENT_PROPS },
        },
        disabled: {
            options: [true, false],
            control: { type: "select" },
            defaultValue: false,
            table: { category: COMPONENT_PROPS },
        },
        forceReRender: { control: false, table: { category: COMPONENT_PROPS } },
        className: { control: false, table: { category: COMPONENT_PROPS } },
        children: { control: false, table: { category: COMPONENT_PROPS } },
        fundingSource: {
            options: [
                FUNDING.PAYPAL,
                FUNDING.CARD,
                FUNDING.CREDIT,
                FUNDING.PAYLATER,
                FUNDING.VENMO,
                undefined,
            ],
            control: {
                type: "select",
                labels: {
                    [FUNDING.PAYPAL]: "paypal",
                    [FUNDING.CARD]: "card",
                    [FUNDING.CREDIT]: "credit",
                    [FUNDING.PAYLATER]: "paylater",
                    [FUNDING.VENMO]: "venmo",
                    undefined: "all",
                },
            },
            table: { category: COMPONENT_PROPS },
        },
        createOrder: { table: { category: COMPONENT_EVENTS } },
        createBillingAgreement: { table: { category: COMPONENT_EVENTS } },
        createSubscription: { table: { category: COMPONENT_EVENTS } },
        onShippingChange: { table: { category: COMPONENT_EVENTS } },
        onApprove: { table: { category: COMPONENT_EVENTS } },
        onCancel: { table: { category: COMPONENT_EVENTS } },
        onClick: { table: { category: COMPONENT_EVENTS } },
        onInit: { table: { category: COMPONENT_EVENTS } },
        onError: { table: { category: COMPONENT_EVENTS } },
    },
    args: {
        // Storybook passes empty functions by default for props like `onShippingChange`.
        // This turns on the `onShippingChange()` feature which uses the popup experience with the Standard Card button.
        // We pass null to opt-out so the inline guest feature works as expected with the Standard Card button.
        onShippingChange: null,
    },
    decorators: [
        (Story: FC, storyArg: { args: { size: number } }): ReactElement => {
            // Workaround to render the story after got the client token,
            // The new experimental loaders doesn't work in Docs views
            const [clientToken, setClientToken] = useState<string | null>(null);

            useEffect(() => {
                (async () => {
                    setClientToken(await getClientToken());
                })();
            }, []);

            return (
                <div style={{ maxWidth: `${storyArg.args.size}%` }}>
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
                        </>
                    )}
                </div>
            );
        },
    ],
};

export const Default: FC<{
    style: {
        color?: "gold" | "blue" | "silver" | "white" | "black";
        height?: number;
        label?:
            | "paypal"
            | "checkout"
            | "buynow"
            | "pay"
            | "installment"
            | "subscribe"
            | "donate";
        layout?: "vertical" | "horizontal";
        shape?: "rect" | "pill";
        tagline?: boolean;
    };
    fundingSource: string;
    disabled: boolean;
    amount: string;
}> = ({ style, fundingSource, disabled, amount }) => {
    // Remember all the arguments props are received from the control panel below
    return (
        <BraintreePayPalButtons
            style={style}
            disabled={disabled}
            fundingSource={fundingSource}
            forceReRender={[style, amount]}
            createOrder={(
                data: Record<string, unknown>,
                actions: CreateBraintreeActions
            ) =>
                actions.braintree
                    .createPayment({
                        flow: "checkout",
                        amount: amount,
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
                    })
                    .then((orderId) => {
                        action("orderId")(orderId);
                        return orderId;
                    })
            }
            onApprove={(
                data: OnApproveData,
                actions: OnApproveBraintreeActions
            ) =>
                actions.braintree
                    .tokenizePayment(
                        data as BraintreePayPalCheckoutTokenizationOptions
                    )
                    .then((payload) => {
                        approveSale(payload.nonce, amount).then((data) => {
                            action("onApprove")(data);
                            // Call server-side endpoint to finish the sale
                        });
                    })
            }
            onError={(err: Record<string, unknown>) => {
                action("onError")(err.toString());
            }}
        />
    );
};
