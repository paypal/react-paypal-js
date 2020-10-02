import React from "react";
import { render, waitFor } from "@testing-library/react";

import { ScriptProvider } from "../ScriptContext";
import PayPalButtons from "./PayPalButtons";

const defaultOptions = {
    shippingPreference: "GET_FROM_FILE",
    style: {},
};

describe("<PayPalButtons />", () => {
    beforeEach(() => {
        window.paypal = {
            Buttons: function () {
                return {
                    close: jest.fn(),
                    isEligible: jest.fn(),
                    render: jest.fn(),
                };
            },
            FUNDING: {
                CREDIT: "credit",
            },
        };
    });

    test("should use CREDIT fundingSource", async () => {
        const spyOnButtons = jest.spyOn(window.paypal, "Buttons");

        render(
            <ScriptProvider options={{ "client-id": "sb" }}>
                <PayPalButtons fundingSource="CREDIT" />
            </ScriptProvider>
        );

        await waitFor(() =>
            expect(spyOnButtons).toHaveBeenCalledWith({
                ...defaultOptions,
                fundingSource: "credit",
            })
        );
    });

    test("should pass an empty object by default", async () => {
        const spyOnButtons = jest.spyOn(window.paypal, "Buttons");

        render(
            <ScriptProvider options={{ "client-id": "sb" }}>
                <PayPalButtons />
            </ScriptProvider>
        );

        await waitFor(() =>
            expect(spyOnButtons).toHaveBeenCalledWith(defaultOptions)
        );
    });
});
