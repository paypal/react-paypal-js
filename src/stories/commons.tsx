import React, { FC, ReactElement, ReactNode } from "react";
import { action } from "@storybook/addon-actions";
import {
    Title,
    Subtitle,
    Description,
    Primary,
    ArgsTable,
    CURRENT_SELECTION,
} from "@storybook/addon-docs";

import { ERROR, SDK } from "./constants";

/**
 * Functional component to render a custom ineligible error UI
 */
export const InEligibleError: FC<{ text?: string }> = ({ text }) => (
    <h3 style={{ color: "#dc3545", textTransform: "capitalize" }}>
        {text || "The component is ineligible to render"}
    </h3>
);

export const defaultProps = {
    onInit(): void {
        action(SDK)("Library initialized and rendered");
    },
    onClick(): void {
        action("button")(
            "Click event dispatch from the the PayPal payment button"
        );
    },
    onError(err: Record<string, unknown>): void {
        action(ERROR)(err.toString());
    },
    onCancel(): void {
        action("payment")("The payment process was cancel");
    },
};

export const generateDocPageStructure = (name: string): JSX.Element => (
    <>
        <Title />
        <Subtitle />
        <Description />
        <Primary name={name} />
        <ArgsTable story={CURRENT_SELECTION} />
    </>
);
