export const COMPONENT_PROPS = "Props";
export const COMPONENT_EVENTS = "Events";
export const COMPONENT_TYPES = "Types";
export const ORDER_ID = "orderID";
export const ERROR = "Error";
export const SDK = "SDK";
export const APPROVE = "approve";

export const CONTAINER_SIZE = {
    name: "container width",
    description:
        "This is not a property from PayPalButtons. It is custom control to change the size of the PayPal buttons container in pixels.",
    control: { type: "range", min: 200, max: 750, step: 5 },
    table: {
        defaultValue: {
            summary: "750px",
        },
        category: "Custom",
        type: { summary: "number" },
    },
};

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
