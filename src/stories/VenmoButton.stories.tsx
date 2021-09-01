import React, { FC } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";

import { PayPalScriptProvider, FUNDING, PayPalButtons } from "../index";
import { getOptionsFromQueryString, generateRandomString } from "./utils";

const scriptProviderOptions: PayPalScriptOptions = {
    "client-id":
        "AdLzRW18VHoABXiBhpX2gf0qhXwiW4MmFVHL69V90vciCg_iBLGyJhlf7EuWtFcdNjGiDfrwe7rmhvMZ",
    components: "buttons,funding-eligibility",
    "enable-funding": "venmo",
    debug: true,
    ...getOptionsFromQueryString(),
};

export default {
    title: "PayPal/VenmoButton",
    parameters: {
        controls: { expanded: true },
        docs: { source: { type: "dynamic" } },
    },
    argTypes: {
        style: {
            description:
                "Styling options for customizing the button appearance.",
            control: { type: "object", expanded: true },
            table: {
                category: "Props",
                type: {
                    summary: `{
                    color?: "blue" | "silver" | "white" | "black";
                    label?:
                        | "paypal"
                        | "checkout"
                        | "buynow"
                        | "pay"
                        | "installment"
                        | "subscribe"
                        | "donate";
                    shape?: "rect" | "pill";
                }`,
                },
            },
        },
        onShippingChange: {
            description:
                "Called when the buyer changes their shipping address on PayPal.",
            control: null,
            table: { category: "Events", type: { summary: "() => void" } },
        },
    },
    args: {
        // Storybook passes empty functions by default for props like `onShippingChange`.
        // This turns on the `onShippingChange()` feature which uses the popup experience with the Standard Card button.
        // We pass null to opt-out so the inline guest feature works as expected with the Standard Card button.
        onShippingChange: null,
        style: {
            color: "blue",
        },
    },
};

export const Default: FC<{
    style: {
        color?: "blue" | "silver" | "white" | "black";
        label?:
            | "paypal"
            | "checkout"
            | "buynow"
            | "pay"
            | "installment"
            | "subscribe"
            | "donate";
        shape?: "rect" | "pill";
    };
}> = ({ style }) => {
    const uid = generateRandomString();

    return (
        <PayPalScriptProvider
            options={{
                ...scriptProviderOptions,
                "data-namespace": uid,
                "data-uid": uid,
            }}
        >
            <PayPalButtons
                fundingSource={FUNDING.VENMO}
                style={style}
                forceReRender={[style]}
            >
                <p>You are not eligible to pay with Venmo.</p>
            </PayPalButtons>
        </PayPalScriptProvider>
    );
};
