import { mock } from "jest-mock-extended";

import { SDK_SETTINGS } from "./constants";
import {
    getPayPalWindowNamespace,
    getBraintreeWindowNamespace,
    hashStr,
    shallowCompareObjects,
} from "./utils";

import type { PayPalNamespace } from "@paypal/paypal-js";
import type { BraintreeNamespace } from "./types";

describe("getPayPalWindowNamespace", () => {
    const mockPayPalNamespace = mock<PayPalNamespace>();

    beforeAll(() => {
        window.paypal = mockPayPalNamespace;
    });

    test("should return the paypal namespace", () => {
        expect(getPayPalWindowNamespace("paypal")).toEqual(window.paypal);
    });

    test("should not found the namespace", () => {
        expect(getPayPalWindowNamespace("testNamespace")).toBeUndefined();
    });
});

describe("getBraintreeWindowNamespace", () => {
    const mockBraintreeNamespace = mock<BraintreeNamespace>();

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).braintree = mockBraintreeNamespace;
    });

    test("should return the paypal namespace", () => {
        expect(getBraintreeWindowNamespace("braintree")).toEqual(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).braintree
        );
    });

    test("should not found the namespace", () => {
        expect(getBraintreeWindowNamespace("testNamespace")).toBeUndefined();
    });
});

describe("hashStr", () => {
    test("should match the hash from the argument string", () => {
        expect(hashStr("react")).toMatchInlineSnapshot(`"xxhjw"`);
        expect(hashStr("react-js.braintree")).toMatchInlineSnapshot(
            `"xxhjbzppoallaomelb"`
        );
        expect(hashStr("react-js.paypal")).toMatchInlineSnapshot(
            `"xxhjbzppiqfhtje"`
        );
        expect(hashStr("")).toMatchInlineSnapshot(`""`);
        expect(
            hashStr(
                JSON.stringify({
                    "client-id":
                        "AfmdXiQAZD1rldTeFe9RNvsz8eBBG-Mltqh6h-iocQ1GUNuXIDnCie9tHcueD_NrMWB9dTlWl34xEK7V",
                    currency: "USD",
                    intent: "authorize",
                    debug: false,
                    vault: false,
                    locale: "US",
                    [SDK_SETTINGS.DATA_NAMESPACE]: "braintree",
                })
            )
        ).toMatchInlineSnapshot(
            `"iiuovjsqddgseaaouopvvtcqciewjblfycugmepzoirvygvhquvfthtdttqasyqcdzbzaepjvxhbwsrjhhcurjzroipxqyishjiubldxsiumrlgiscmehhggkwzxusrrdpdxisuuektdeudjrtosskdpcksyhttbqsqsvdsoaugkffisgkusjvhthnqmlzgqccmutvqaztoqu"`
        );
    });
});

describe("shallowCompareObjects", () => {
    test("should return true if the objects are the same", () => {
        const obj = { a: 1, b: 2 };
        expect(shallowCompareObjects(obj, obj)).toBe(true);
    });

    test("should return true if the objects has the same value but different references", () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, b: 2 };
        expect(shallowCompareObjects(objA, objB)).toBe(true);
    });

    test("should return false if the objects has different values", () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, b: 3 };
        expect(shallowCompareObjects(objA, objB)).toBe(false);
    });

    test("should return false if the objects has different keys", () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, b: 2, c: 3 };
        expect(shallowCompareObjects(objA, objB)).toBe(false);
    });

    test("should return false for two equal nested objects", () => {
        const objA = { a: 1, b: { c: 2 } };
        const objB = { a: 1, b: { c: 2 } };
        expect(shallowCompareObjects(objA, objB)).toBe(false);
    });

    test("should return true for two different nested objects", () => {
        const objA = { a: 1, b: { c: 2 } };
        const objB = { a: 1, b: { c: 3 } };
        expect(shallowCompareObjects(objA, objB)).toBe(false);
    });
});
