import React, { useState, FC, ChangeEvent } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import { action } from "@storybook/addon-actions";

import {
    PayPalScriptProvider,
    PayPalMarks,
    PayPalButtons,
    FUNDING,
} from "../index";
import { getOptionsFromQueryString } from "./utils";
import {
    COMPONENT_PROPS,
    ARG_TYPE_AMOUNT,
    ORDER_ID,
    APPROVE,
    ERROR,
} from "./constants";
import { InEligibleError } from "./commons";
import type { Story } from "@storybook/react/types-6-0";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons,marks,funding-eligibility",
    ...getOptionsFromQueryString(),
};
const fundingSources = [FUNDING.PAYPAL, FUNDING.CARD, FUNDING.PAYLATER];

export default {
    title: "PayPal/PayPalMarks",
    component: PayPalMarks,
    parameters: {
        options: { showFunctions: true },
        controls: { expanded: true },
        docs: { source: { type: "code" } },
    },
    argTypes: {
        amount: ARG_TYPE_AMOUNT,
        className: { control: null, table: { category: "Props" } },
        fundingSource: {
            options: [
                FUNDING.PAYPAL,
                FUNDING.CARD,
                FUNDING.PAYLATER,
                undefined,
            ],
            control: {
                type: "select",
                labels: {
                    [FUNDING.PAYPAL]: "paypal",
                    [FUNDING.CARD]: "card",
                    [FUNDING.PAYLATER]: "paylater",
                    undefined: "all",
                },
            },
            table: { category: COMPONENT_PROPS },
        },
    },
    args: {
        amount: "2",
    },
};

export const Default: FC<{ fundingSource: string }> = ({ fundingSource }) => (
    <PayPalScriptProvider options={scriptProviderOptions}>
        <PayPalMarks fundingSource={fundingSource} />
    </PayPalScriptProvider>
);

export const RadioButtons: FC<{ amount: string }> = ({ amount }) => {
    // Remember the amount props is received from the control panel
    const [selectedFundingSource, setSelectedFundingSource] = useState(
        fundingSources[0]
    );

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        setSelectedFundingSource(event.target.value);
    }

    return (
        <PayPalScriptProvider options={scriptProviderOptions}>
            <form style={{ minHeight: "200px" }}>
                {fundingSources.map((fundingSource) => (
                    <label className="mark" key={fundingSource}>
                        <input
                            defaultChecked={
                                fundingSource === selectedFundingSource
                            }
                            onChange={onChange}
                            type="radio"
                            name="fundingSource"
                            value={fundingSource}
                        />
                        <PayPalMarks fundingSource={fundingSource} />
                    </label>
                ))}
            </form>
            <br />
            <PayPalButtons
                fundingSource={selectedFundingSource}
                forceReRender={[selectedFundingSource, amount]}
                style={{ color: "white" }}
                createOrder={(
                    data: Record<string, unknown>,
                    actions: CreateOrderActions
                ) => {
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
                }}
                onApprove={(data: OnApproveData, actions: OnApproveActions) => {
                    return actions.order.capture().then(function (details) {
                        action(APPROVE)(details);
                    });
                }}
                onError={(err: Record<string, unknown>) => {
                    action(ERROR)(err.toString());
                }}
            >
                <InEligibleError />
            </PayPalButtons>
        </PayPalScriptProvider>
    );
};

(Default as Story).parameters = {
    docs: { source: { type: "dynamic" } },
};

(Default as Story).argTypes = {
    amount: { control: false },
};

(RadioButtons as Story).argTypes = {
    fundingSource: { control: false },
};
