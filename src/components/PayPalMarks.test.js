import React from "react";
import { render, waitFor } from "@testing-library/react";

import { ScriptProvider } from "../ScriptContext";
import PayPalMarks from "./PayPalMarks";

describe("<PayPalMarks />", () => {
    beforeEach(() => {
        window.paypal = {
            Marks: function () {
                return {
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
        const spyOnMarks = jest.spyOn(window.paypal, "Marks");

        render(
            <ScriptProvider options={{ "client-id": "sb" }}>
                <PayPalMarks fundingSource="CREDIT" />
            </ScriptProvider>
        );

        await waitFor(() =>
            expect(spyOnMarks).toHaveBeenCalledWith({ fundingSource: "credit" })
        );
    });

    test("should pass an empty object by default", async () => {
        const spyOnMarks = jest.spyOn(window.paypal, "Marks");

        render(
            <ScriptProvider options={{ "client-id": "sb" }}>
                <PayPalMarks />
            </ScriptProvider>
        );

        await waitFor(() => expect(spyOnMarks).toHaveBeenCalledWith({}));
    });
});
