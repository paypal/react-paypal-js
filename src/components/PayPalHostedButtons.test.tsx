import React, { useState } from "react";
import {
    render,
    waitFor,
    screen,
    fireEvent,
    act,
} from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { mock } from "jest-mock-extended";
import { loadScript } from "@paypal/paypal-js";

import { PayPalHostedButtons } from "./PayPalHostedButtons";
import { PayPalScriptProvider } from "./PayPalScriptProvider";
import { FUNDING } from "../index";

import type { ReactNode } from "react";
import type {
    PayPalHostedButtonsComponent,
    PayPalHostedButtonsComponentOptions,
    PayPalNamespace,
} from "@paypal/paypal-js";

jest.mock("@paypal/paypal-js", () => ({
    loadScript: jest.fn(),
}));

const mockPaypalHostedButtonsComponent = mock<PayPalHostedButtonsComponent>();
mockPaypalHostedButtonsComponent.render.mockResolvedValue();

const mockPayPalNamespace = mock<PayPalNamespace>();

mockPayPalNamespace.HostedButtons = jest
    .fn()
    .mockReturnValue(mockPaypalHostedButtonsComponent);

describe("<PayPalHostedButtons />", () => {
    beforeEach(() => {
        document.body.innerHTML = "";

        window.paypal = mockPayPalNamespace;

        (loadScript as jest.Mock).mockResolvedValue(window.paypal);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should pass props to window.paypal.HostedButtons()", async () => {
        render(
            <PayPalScriptProvider options={{ clientId: "test" }}>
                <PayPalHostedButtons hostedButtonId="B123456789" />
            </PayPalScriptProvider>
        );

        await waitFor(() =>
            expect(window.paypal?.HostedButtons).toHaveBeenCalledWith({
                hostedButtonId: "B123456789",
            })
        );
    });
});
