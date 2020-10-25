import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { PayPalScriptProvider, usePayPalScriptReducer } from "./ScriptContext";
import { loadScript } from "@paypal/paypal-js";

jest.mock("@paypal/paypal-js", () => ({
    loadScript: jest.fn(),
}));

describe("<PayPalScriptProvider />", () => {
    beforeEach(() => {
        loadScript.mockResolvedValue({});
    });

    test('should set "loadingStatus" state to "resolved" after loading the script', async () => {
        const { state, TestComponent } = setupTestComponent();
        render(
            <PayPalScriptProvider options={{ "client-id": "sb" }}>
                <TestComponent />
            </PayPalScriptProvider>
        );

        // verify initial loading state
        expect(state.loadingStatus).toBe("pending");
        await waitFor(() => expect(state.loadingStatus).toBe("resolved"));
        expect(loadScript).toHaveBeenCalledWith({ "client-id": "sb" });
    });
});

describe("usePayPalScriptReducer", () => {
    beforeEach(() => {
        loadScript.mockResolvedValue({});
    });

    test('should manage state for loadScript() options and for "isLoaded"', async () => {
        const { state, TestComponent } = setupTestComponent();
        render(
            <PayPalScriptProvider options={{ "client-id": "sb" }}>
                <TestComponent />
            </PayPalScriptProvider>
        );

        expect(state.options).toHaveProperty("client-id", "sb");
        expect(state.loadingStatus).toBe("pending");
        await waitFor(() => expect(state.loadingStatus).toBe("resolved"));
    });

    test("should throw an error when used without <PayPalScriptProvider>", () => {
        const { TestComponent } = setupTestComponent();

        jest.spyOn(console, "error");
        console.error.mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow();
        console.error.mockRestore();
    });

    test("should use action 'resetOptions' to reload with new params", async () => {
        const { state, TestComponent } = setupTestComponent();

        render(
            <PayPalScriptProvider options={{ "client-id": "abc" }}>
                <TestComponent>
                    <ResetParamsOnClick
                        options={{ "client-id": "xyz", disableFunding: "card" }}
                    />
                </TestComponent>
            </PayPalScriptProvider>
        );

        expect(state.options).toMatchObject({ "client-id": "abc" });
        expect(loadScript).toHaveBeenCalledWith(state.options);

        await waitFor(() => expect(state.loadingStatus).toBe("resolved"));

        // this click dispatches the action "resetOptions" causing the script to reload
        fireEvent.click(screen.getByText("Reload button"));
        await waitFor(() => expect(state.loadingStatus).toBe("resolved"));

        expect(state.options).toMatchObject({
            "client-id": "xyz",
            disableFunding: "card",
        });
        expect(loadScript).toHaveBeenCalledWith(state.options);
    });
});

function setupTestComponent() {
    const state = {};
    function TestComponent({ children = null }) {
        const [scriptState] = usePayPalScriptReducer();
        Object.assign(state, scriptState);
        return children;
    }

    return {
        state,
        TestComponent,
    };
}

// eslint-disable-next-line react/prop-types
function ResetParamsOnClick({ options }) {
    const [, dispatch] = usePayPalScriptReducer();

    function onClick() {
        dispatch({ type: "resetOptions", value: options });
    }

    return <button onClick={onClick}>Reload button</button>;
}
