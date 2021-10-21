import React, { FC, ReactElement, useEffect } from "react";
import { action } from "@storybook/addon-actions";

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
} from "../index";
import { getOptionsFromQueryString, generateRandomString } from "./utils";
import { ARG_TYPE_AMOUNT, ORDER_ID, InEligibleError } from "./constants";
import type { PayPalButtonsComponentProps } from "../types/paypalButtonTypes";

const subscriptionOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    intent: "subscription",
    vault: true,
    ...getOptionsFromQueryString(),
};

const buttonSubscriptionOptions = {
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
};

const orderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

export default {
    title: "PayPal/Subscriptions",
    parameters: {
        controls: { expanded: true },
        docs: { source: { type: "code" } },
    },
    argTypes: {
        type: {
            control: "select",
            options: ["subscription", "order"],
            table: {
                category: "Custom",
                type: { summary: "string" },
                defaultValue: {
                    summary: "subscription",
                },
            },
            description: "Change the PayPal checkout intent.",
        },
        amount: ARG_TYPE_AMOUNT,
    },
    args: {
        type: "subscription",
        amount: "2",
    },
    decorators: [
        (Story: FC): ReactElement => {
            const uid = generateRandomString();

            return (
                <PayPalScriptProvider
                    options={{
                        ...subscriptionOptions,
                        "data-namespace": uid,
                        "data-uid": uid,
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
        options.intent === "subscription"
            ? buttonSubscriptionOptions
            : {
                  createOrder(
                      data: Record<string, unknown>,
                      actions: CreateOrderActions
                  ) {
                      return actions.order
                          .create({
                              purchase_units: [
                                  {
                                      amount: {
                                          value: amount,
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
                          action("onApprove")(details);
                      });
                  },
                  onError(err: Record<string, unknown>) {
                      action("onError")(err.toString());
                  },
              };

    useEffect(() => {
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: type === "subscription" ? subscriptionOptions : orderOptions,
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
