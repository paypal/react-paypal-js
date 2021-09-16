import React from "react";

import { PayPalHostedField } from "./PayPalHostedField";
import {
    HOSTED_FIELDS_CHILDREN_ERROR,
    HOSTED_FIELDS_DUPLICATE_CHILDREN_ERROR,
    HOSTED_FIELDS_COMBINE_CHILDREN_ERROR,
} from "../../constants";
import { PAYPAL_HOSTED_FIELDS_TYPES } from "../../types/enums";
import { validateHostedFieldChildren } from "./validators.ts";

describe("validateHostedFieldChildren", () => {
    test("should fail when empty children", () => {
        expect(() => {
            validateHostedFieldChildren([]);
        }).toThrow(new Error(HOSTED_FIELDS_CHILDREN_ERROR));
    });

    test("should fail using only two children", () => {
        expect(() => {
            validateHostedFieldChildren([
                <PayPalHostedField
                    key="0"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                />,
                <PayPalHostedField
                    key="1"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                />,
            ]);
        }).toThrow(new Error(HOSTED_FIELDS_CHILDREN_ERROR));
    });

    test("should fail when using only expirationMonth or expiration Year", () => {
        expect(() => {
            validateHostedFieldChildren([
                <PayPalHostedField
                    key=".0"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                />,
                <PayPalHostedField
                    key=".1"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                />,
                <PayPalHostedField
                    key=".2"
                    hostedFieldType={
                        PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH
                    }
                />,
            ]);
        }).toThrow(new Error(HOSTED_FIELDS_CHILDREN_ERROR));
    });

    test("should fail when using duplicate children", () => {
        expect(() => {
            validateHostedFieldChildren([
                <PayPalHostedField
                    key=".0"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                />,
                <PayPalHostedField
                    key=".1"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                />,
                <PayPalHostedField
                    key=".2"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                />,
                <PayPalHostedField
                    key=".3"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                />,
            ]);
        }).toThrow(new Error(HOSTED_FIELDS_DUPLICATE_CHILDREN_ERROR));
    });

    test("should fail combining expirationDate with expirationMonth or expiration Year", () => {
        expect(() => {
            validateHostedFieldChildren([
                <PayPalHostedField
                    key=".0"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                />,
                <PayPalHostedField
                    key=".1"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                />,
                <PayPalHostedField
                    key=".2"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                />,
                <PayPalHostedField
                    key=".3"
                    hostedFieldType={
                        PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH
                    }
                />,
            ]);
        }).toThrow(new Error(HOSTED_FIELDS_COMBINE_CHILDREN_ERROR));
    });

    test("should not throw error using required default children", () => {
        expect(() => {
            validateHostedFieldChildren([
                <PayPalHostedField
                    key=".0"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.NUMBER}
                />,
                <PayPalHostedField
                    key=".1"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE}
                />,
                <PayPalHostedField
                    key=".2"
                    hostedFieldType={PAYPAL_HOSTED_FIELDS_TYPES.CVV}
                />,
            ]);
        }).not.toThrow();
    });
});
