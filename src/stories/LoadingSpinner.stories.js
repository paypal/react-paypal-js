import React from "react";
import {
    PayPalScriptProvider,
    usePayPalScriptReducer,
    PayPalButtons,
} from "../index";

export default {
    title: "Example/LoadingSpinner",
};

function Template(args) {
    return (
        <PayPalScriptProvider
            options={{ "client-id": "sb", components: "buttons" }}
        >
            <LoadingSpinner />
            <PayPalButtons {...args} />
        </PayPalScriptProvider>
    );
}

export const Default = Template.bind({});
Default.args = {};

function LoadingSpinner() {
    const [{ isLoaded }] = usePayPalScriptReducer();

    if (isLoaded) return null;
    if (!isLoaded) return <div className="spinner" />;
}
