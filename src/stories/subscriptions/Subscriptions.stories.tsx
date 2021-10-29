import React, { FC, ReactElement, useEffect } from "react";
import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";

import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type { CreateSubscriptionActions } from "@paypal/paypal-js/types/components/buttons";
import type {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";

import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
    DISPATCH_ACTION,
} from "../../index";
import { getOptionsFromQueryString, generateRandomString } from "../utils";
import { ARG_TYPE_AMOUNT, ORDER_ID, APPROVE } from "../constants";
import { InEligibleError, defaultProps } from "../commons";
import type { PayPalButtonsComponentProps } from "../../types/paypalButtonTypes";
import overrideStories from "./code";

const SUBSCRIPTION = "subscription";
const subscriptionOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    vault: true,
    ...getOptionsFromQueryString(),
};

const buttonSubscriptionProps = {
    createSubscription(
        data: Record<string, unknown>,
        actions: CreateSubscriptionActions
    ) {
        return actions.subscription
            .create({
                plan_id: PLAN_ID,
            })
            .then((orderId) => {
                action("subscriptionOrder")(orderId);
                return orderId;
            });
    },
    style: {
        label: "subscribe",
    },
    ...defaultProps,
};

const buttonOrderProps = (amountValue: string) => ({
    createOrder(data: Record<string, unknown>, actions: CreateOrderActions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: amountValue,
                        },
                    },
                ],
            })
            .then((orderId) => {
                action(ORDER_ID)(orderId);
                return orderId;
            });
    },
    onApprove(data: OnApproveData, actions: OnApproveActions) {
        return actions.order.capture().then(function (details) {
            action(APPROVE)(details);
        });
    },
    ...defaultProps,
});

const orderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

export default {
    title: "PayPal/Subscriptions",
    parameters: {
        controls: { expanded: true },
    },
    argTypes: {
        type: {
            control: "select",
            options: [SUBSCRIPTION, "capture"],
            table: {
                category: "Custom",
                type: { summary: "string" },
                defaultValue: {
                    summary: SUBSCRIPTION,
                },
            },
            description: "Change the PayPal checkout intent.",
        },
        amount: ARG_TYPE_AMOUNT,
    },
    args: {
        type: SUBSCRIPTION,
        amount: "2",
    },
    decorators: [
        (Story: FC, storyArgs: { args: { type: string } }): ReactElement => {
            const uid = generateRandomString();

            return (
                <PayPalScriptProvider
                    options={{
                        ...subscriptionOptions,
                        "data-namespace": uid,
                        "data-uid": uid,
                        intent: storyArgs.args.type,
                    }}
                >
                    <div style={{ minHeight: "250px" }}>
                        <Story />
                    </div>
                </PayPalScriptProvider>
            );
        },
    ],
};

const PLAN_ID = "P-3RX065706M3469222L5IFM4I";

export const Default: FC<{ type: string; amount: string }> = ({
    type,
    amount,
}) => {
    // Remember the type and amount props are received from the control panel
    const [{ options }, dispatch] = usePayPalScriptReducer();
    const buttonOptions =
        options.intent === SUBSCRIPTION
            ? buttonSubscriptionProps
            : buttonOrderProps(amount);

    useEffect(() => {
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: type === SUBSCRIPTION ? subscriptionOptions : orderOptions,
        });
    }, [type, dispatch]);

    return (
        <PayPalButtons
            forceReRender={[type, amount]}
            {...(buttonOptions as PayPalButtonsComponentProps)}
        >
            <InEligibleError />
        </PayPalButtons>
    );
};

overrideStories();
