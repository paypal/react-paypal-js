import React from "react";
import { render } from "@testing-library/react";

import { PayPalHostedField } from "./PayPalHostedField";
import { PAYPAL_HOSTED_FIELDS_TYPES } from "../../types/enums";

describe("PayPalHostedField", () => {
    test("should render component", () => {
        const { container } = render(
            <PayPalHostedField
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{ selector: "number" }}
            />
        );

        expect(
            container.querySelector(".number") instanceof HTMLDivElement
        ).toBeTruthy();
    });

    test("should render component with a list of classes", () => {
        const { container } = render(
            <PayPalHostedField
                classes={["a", "b", "c"]}
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{ selector: "number" }}
            />
        );
        const renderedElement = container.querySelector(".number");

        expect(renderedElement.classList.contains("a")).toBeTruthy();
        expect(renderedElement.classList.contains("b")).toBeTruthy();
        expect(renderedElement.classList.contains("c")).toBeTruthy();
    });

    test("should render component with specific style", () => {
        const { container } = render(
            <PayPalHostedField
                style={{
                    color: "black",
                    border: "1px solid",
                }}
                hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                options={{ selector: "number" }}
            />
        );
        const renderedElement = container.querySelector(".number");

        expect(renderedElement.style.color).toEqual("black");
        expect(renderedElement.style.border).toEqual("1px solid");
    });
});
