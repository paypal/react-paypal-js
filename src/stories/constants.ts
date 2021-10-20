export const COMPONENT_PROPS = "Props";

export const COMPONENT_EVENTS = "Events";

export const ARG_TYPE_AMOUNT = {
    description:
        "This is not a property from PayPalButtons. It is custom control for testing the amount sent in the createOrder process",
    options: ["2", "30", "100"],
    control: {
        type: "select",
    },
    table: {
        defaultValue: {
            summary: "2.00",
        },
        category: "Custom",
        type: { summary: "number|string" },
    },
};
