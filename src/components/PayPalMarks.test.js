import React from "react";
import { render, waitFor } from "@testing-library/react";

import { PayPalScriptProvider } from "../components/PayPalScriptProvider.tsx";
import { PayPalMarks } from "./PayPalMarks";
import { FUNDING } from "@paypal/sdk-constants";
import { loadScript } from "@paypal/paypal-js";
import { ErrorBoundary } from "react-error-boundary";

jest.mock("@paypal/paypal-js", () => ({
    loadScript: jest.fn(),
}));

const onError = jest.fn();
const wrapper = ({ children }) => (
    <ErrorBoundary fallback={<div>Error</div>} onError={onError}>
        {children}
    </ErrorBoundary>
);

describe("<PayPalMarks />", () => {
    beforeEach(() => {
        window.paypal = {};
        loadScript.mockResolvedValue(window.paypal);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should pass props to window.paypal.Marks()", async () => {
        window.paypal = {
            Marks: jest.fn(() => ({
                isEligible: jest.fn().mockReturnValue(true),
                render: jest.fn().mockResolvedValue({}),
            })),
        };

        render(
            <PayPalScriptProvider
                options={{ "client-id": "test", components: "marks" }}
            >
                <PayPalMarks fundingSource={FUNDING.CREDIT} />
            </PayPalScriptProvider>
        );

        await waitFor(() =>
            expect(window.paypal.Marks).toHaveBeenCalledWith({
                fundingSource: FUNDING.CREDIT,
            })
        );
    });

    test("should use className prop and add to div container", async () => {
        window.paypal = {
            Marks: jest.fn(() => ({
                isEligible: jest.fn().mockReturnValue(true),
                render: jest.fn().mockResolvedValue({}),
            })),
        };

        render(
            <PayPalScriptProvider
                options={{ "client-id": "test", components: "marks" }}
            >
                <PayPalMarks className="custom-class-name" />
            </PayPalScriptProvider>
        );

        await waitFor(() =>
            expect(document.querySelector("div.custom-class-name")).toBeTruthy()
        );
    });

    test("should throw an error when no components are passed to the PayPalScriptProvider", async () => {
        const spyConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation();
        render(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks />
            </PayPalScriptProvider>,
            { wrapper }
        );

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(onError.mock.calls[0][0].message).toMatchSnapshot();
        spyConsoleError.mockRestore();
    });

    test("should throw an error when the 'marks' component is missing from the components list passed to the PayPalScriptProvider", async () => {
        const spyConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation();
        render(
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    components: "buttons,messages",
                }}
            >
                <PayPalMarks />
            </PayPalScriptProvider>,
            { wrapper }
        );

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(onError.mock.calls[0][0].message).toMatchSnapshot();
        spyConsoleError.mockRestore();
    });

    test("should catch and throw unexpected zoid render errors", async () => {
        const spyConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation();
        window.paypal.Marks = () => {
            return {
                isEligible: jest.fn().mockReturnValue(true),
                render: jest.fn((element) => {
                    // simulate adding markup for paypal mark
                    element.append(document.createElement("div"));
                    return Promise.reject("Unknown error");
                }),
            };
        };

        render(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks />
            </PayPalScriptProvider>,
            { wrapper }
        );

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(onError.mock.calls[0][0].message).toMatchSnapshot();
        spyConsoleError.mockRestore();
    });

    test("should safely ignore error on render process when paypal marks container is no longer in the DOM ", async () => {
        const spyConsoleError = jest
            .spyOn(console, "error")
            .mockImplementation();
        window.paypal.Marks = () => ({
            isEligible: jest.fn().mockReturnValue(true),
            render: jest.fn((element) => {
                element.removeAttribute("class");
                return Promise.reject(new Error("Unknow error"));
            }),
        });
        const { container } = render(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks className="test-class" />
            </PayPalScriptProvider>
        );

        await waitFor(() =>
            expect(
                container.querySelector(".test-class") instanceof HTMLDivElement
            ).toBeFalsy()
        );
        spyConsoleError.mockRestore();
    });

    test("should not render component when ineligible", async () => {
        const mockIsEligible = jest.fn().mockReturnValue(false);
        const mockRender = jest.fn().mockResolvedValue();

        // Make Marks not eligible
        window.paypal.Marks = () => ({
            isEligible: mockIsEligible,
            render: mockRender,
        });

        render(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks />
            </PayPalScriptProvider>
        );

        await waitFor(() => expect(mockIsEligible).toBeCalled());
        expect(mockRender).not.toBeCalled();
    });

    test("should rerender the component when the funding source change", async () => {
        window.paypal.Marks = () => ({
            isEligible: jest.fn().mockReturnValue(true),
            render: (element) => {
                const markElement = document.createElement("div");

                markElement.setAttribute("id", "children-div");
                element.append(markElement);
                return Promise.resolve();
            },
        });

        const { container, rerender } = render(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks fundingSource="paypal" />
            </PayPalScriptProvider>
        );

        await waitFor(() =>
            expect(
                container.querySelector("#children-div") instanceof
                    HTMLDivElement
            ).toBeTruthy()
        );

        rerender(
            <PayPalScriptProvider options={{ "client-id": "test" }}>
                <PayPalMarks fundingSource="card" />
            </PayPalScriptProvider>
        );
    });
});
