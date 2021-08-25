export const COMPONENT_PROPS = "Props";

export const COMPONENT_EVENTS = "Events";

export const ARG_TYPE_AMOUNT = {
    description:
        "This is not a property from PayPalButtons. It is custom control for testing the amount sent in the createOrder process",
    options: ["2.00", "30.00", "100.00"],
    control: {
        type: "select",
    },
    defaultValue: "2.00",
    table: {
        defaultValue: {
            summary: "2.00",
        },
        category: "Custom",
        type: { summary: "number|string" },
    },
};
