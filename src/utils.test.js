import {
    isUndefined,
    undefinedArgumentErrorMessage,
    getNamespace,
    hashStr,
} from "./utils";

describe("testing isUndefined util function", () => {
    test("should not be undefined real values", () => {
        expect(isUndefined(10)).toBeFalsy();
        expect(isUndefined("a")).toBeFalsy();
        expect(isUndefined({})).toBeFalsy();
        expect(isUndefined(false)).toBeFalsy();
        expect(isUndefined(null)).toBeFalsy();
    });

    test("should be undefined", () => {
        expect(isUndefined(undefined)).toBeTruthy();
    });
});

describe("testing undefinedArgumentErrorMessage util function", () => {
    test("should return the error message with argument", () => {
        expect(undefinedArgumentErrorMessage("myFunction")).toEqual(
            "Argument cannot be undefined calling myFunction function"
        );
    });

    test("should return the error message with argument transform to string", () => {
        expect(undefinedArgumentErrorMessage(null)).toEqual(
            "Argument cannot be undefined calling null function"
        );
    });
});

describe("testing getPayPalWindowNamespace util function", () => {
    const paypal = {
        Buttons: jest.fn(),
    };
    const braintree = {
        createPayment: jest.fn(),
        client: jest.fn(),
    };

    beforeAll(() => {
        window.paypal = paypal;
        window.braintree = braintree;
    });

    test("should return the paypal namespace", () => {
        expect(getNamespace("paypal")).toEqual(paypal);
    });

    test("should return the paypal namespace", () => {
        expect(getNamespace("braintree")).toEqual(braintree);
    });

    test("should not found the namespace", () => {
        expect(getNamespace("testNamespace")).toBeUndefined();
    });
});

describe("testing hashStr util function", () => {
    test("should match the hash from the argument string", () => {
        expect(hashStr("react")).toMatchSnapshot();
        expect(hashStr("react-js.braintree")).toMatchSnapshot();
        expect(hashStr("react-js.paypal")).toMatchSnapshot();
    });
});
