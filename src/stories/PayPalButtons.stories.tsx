import React, { FC, ReactElement, useEffect } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import { usePayPalScriptReducer, DISPATCH_ACTION } from "../index";
import { action } from "@storybook/addon-actions";

import { PayPalScriptProvider, PayPalButtons, FUNDING } from "../index";
import { getOptionsFromQueryString, generateRandomString } from "./utils";
import {
    COMPONENT_PROPS,
    COMPONENT_EVENTS,
    ARG_TYPE_AMOUNT,
} from "./constants";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

const LoadingSpinner: FC = () => {
    const [{ isPending }] = usePayPalScriptReducer();

    return isPending ? <div className="spinner" /> : null;
};

export default {
    title: "PayPal/PayPalButtons",
    component: PayPalButtons,
    parameters: {
        controls: { expanded: true, sort: "requiredFirst" },
        docs: { source: { type: "code" } },
    },
    argTypes: {
        currency: {
            options: ["USD", "EUR", "CAD"],
            description:
                "This is not a property from PayPalButtons. It is custom control to change the currency create create a PayPal order.",
            control: {
                type: "select",
                labels: {
                    USD: "United State Dollar",
                    EUR: "Euro",
                    CAD: "Canadian Dollar",
                },
            },
            table: {
                category: "Custom",
                type: { summary: "string" },
                defaultValue: { summary: "USD" },
            },
        },
        amount: ARG_TYPE_AMOUNT,
        size: {
            name: "container size",
            description:
                "This is not a property from PayPalButtons. It is custom control to change the size of the PayPal buttons container in pixels.",
            control: { type: "range", min: 200, max: 750, step: 5 },
            table: {
                defaultValue: {
                    summary: "750px",
                },
                category: "Custom",
                type: { summary: "number" },
            },
        },
        showSpinner: {
            description:
                "This is not a property from PayPalButtons. It is custom control to show or not a spinner when PayPal SDK is loading.",
            options: [true, false],
            control: { type: "select" },
            table: {
                defaultValue: {
                    summary: "false",
                },
                category: "Custom",
                type: { summary: "boolean" },
            },
        },
        style: {
            control: { type: "object" },
            table: { category: COMPONENT_PROPS },
        },
        disabled: {
            options: [true, false],
            control: { type: "select" },
            table: { category: COMPONENT_PROPS },
        },
        forceReRender: { control: false, table: { category: COMPONENT_PROPS } },
        className: { control: false, table: { category: COMPONENT_PROPS } },
        children: { table: { disable: true } },
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
        amount: "2.00",
        currency: "USD",
        size: 750,
        showSpinner: false,
        style: {
            layout: "vertical",
        },
        disabled: false,
    },
    decorators: [
        (Story: FC, storyArg: { args: { size: number } }): ReactElement => {
            const uid = generateRandomString();

            return (
                <div style={{ maxWidth: `${storyArg.args.size}px` }}>
                    <PayPalScriptProvider
                        options={{
                            ...scriptProviderOptions,
                            "data-namespace": uid,
                            "data-uid": uid,
                        }}
                    >
                        <div style={{ minHeight: "200px" }}>
                            <Story />
                        </div>
                    </PayPalScriptProvider>
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
    currency: string;
    amount: string;
    showSpinner: boolean;
}> = ({ style, fundingSource, disabled, currency, amount, showSpinner }) => {
    const [{ options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: {
                ...options,
                currency: currency,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency]);

    useEffect(() => {
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: {
                ...options,
                "data-order-id": Date.now().toString(),
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSpinner]);

    return (
        <>
            {showSpinner && <LoadingSpinner />}
            <PayPalButtons
                style={style}
                disabled={disabled}
                fundingSource={fundingSource}
                forceReRender={[style, currency, amount]}
                createOrder={(
                    data: Record<string, unknown>,
                    actions: CreateOrderActions
                ) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount,
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            action("orderId")(orderId);
                            return orderId;
                        });
                }}
                onApprove={(data: OnApproveData, actions: OnApproveActions) => {
                    return actions.order.capture().then(function (details) {
                        action("onApprove")(details);
                    });
                }}
                onError={(err: Record<string, unknown>) => {
                    action("onError")(err.toString());
                }}
            />
        </>
    );
};

export const Donate: FC<{ amount: string }> = ({ amount }) => (
    <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        forceReRender={[amount]}
        style={{ label: "donate" }}
        createOrder={(data, actions) => {
            return actions.order
                .create({
                    purchase_units: [
                        {
                            amount: {
                                value: amount,
                                breakdown: {
                                    item_total: {
                                        currency_code: "USD",
                                        value: amount,
                                    },
                                },
                            },
                            items: [
                                {
                                    name: "donation-example",
                                    quantity: "1",
                                    unit_amount: {
                                        currency_code: "USD",
                                        value: amount,
                                    },
                                    category: "DONATION",
                                },
                            ],
                        },
                    ],
                })
                .then((orderId) => {
                    action("orderId")(orderId);
                    return orderId;
                });
        }}
    />
);
