import {
    throwMissingHostedFieldsError,
    decorateHostedFields,
    addHostedFieldStyles,
    concatClassName,
} from "./utils";
import { DATA_NAMESPACE } from "../../constants";

const exceptionMessagePayPalNamespace =
    "Unable to render <HostedFields /> because window.paypal.HostedFields is undefined.\n    To fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider:\n        <PayPalScriptProvider options={{ components: ',hosted-fields'}}>\n    ";

describe("throwMissingHostedFieldsError", () => {
    const exceptionMessage =
        "Unable to render <HostedFields /> because window.Braintree.HostedFields is undefined.\n    To fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider:\n        <PayPalScriptProvider options={{ components: ',hosted-fields'}}>\n    ";

    test("should throw exception with Braintree namespace", () => {
        expect(() => {
            throwMissingHostedFieldsError({
                [DATA_NAMESPACE]: "Braintree",
            });
        }).toThrow(new Error(exceptionMessage));
    });

    test("should throw exception with default namespace", () => {
        expect(() => {
            throwMissingHostedFieldsError({});
        }).toThrow(new Error(exceptionMessagePayPalNamespace));
    });
});

describe("decorateHostedFields", () => {
    test("should throw exception when HostedFields is unavailable", () => {
        window.paypal = {};

        expect(() => {
            decorateHostedFields({});
        }).toThrow(new Error(exceptionMessagePayPalNamespace));
    });

    test("should decvorate the HostedFields when is available", () => {
        window.paypal = {
            HostedFields: {},
        };
        const decoratedHostedFields = decorateHostedFields({});

        expect(decoratedHostedFields).toHaveProperty("close");
    });
});

describe("addHostedFieldStyles", () => {
    test("should add style to the current page", () => {
        const linkElement = addHostedFieldStyles();

        expect(linkElement instanceof HTMLLinkElement).toBeTruthy();
    });
});

describe("concatClassName", () => {
    test("should return empty string when pass empty argument", () => {
        const result = concatClassName();

        expect(result).toEqual("");
    });

    test("should return empty string when pass empty array as argument", () => {
        const result = concatClassName([]);

        expect(result).toEqual("");
    });

    test("should concat classes array", () => {
        const result = concatClassName(["a", "b"]);

        expect(result).toEqual("a b");
    });

    test("should concat classes array with a space at the beginning", () => {
        const result = concatClassName(["a", "b"], true);

        expect(result).toEqual(" a b");
    });
});
