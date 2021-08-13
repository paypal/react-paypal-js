import {
    getPayPalWindowNamespace,
    getBraintreeWindowNamespace,
    hashStr,
} from "./utils";

describe("testing getPayPalWindowNamespace util function", () => {
    const paypal = {
        Buttons: jest.fn(),
    };

    beforeAll(() => {
        window.paypal = paypal;
    });

    test("should return the paypal namespace", () => {
        expect(getPayPalWindowNamespace("paypal")).toEqual(paypal);
    });

    test("should not found the namespace", () => {
        expect(getPayPalWindowNamespace("testNamespace")).toBeUndefined();
    });
});

describe("testing getBraintreeWindowNamespace util function", () => {
    const braintree = {
        createPayment: jest.fn(),
        client: jest.fn(),
    };

    beforeAll(() => {
        window.braintree = braintree;
    });

    test("should return the paypal namespace", () => {
        expect(getBraintreeWindowNamespace("braintree")).toEqual(braintree);
    });

    test("should not found the namespace", () => {
        expect(getBraintreeWindowNamespace("testNamespace")).toBeUndefined();
    });
});

describe("testing hashStr util function", () => {
    test("should match the hash from the argument string", () => {
        expect(hashStr("react")).toMatchSnapshot();
        expect(hashStr("react-js.braintree")).toMatchSnapshot();
        expect(hashStr("react-js.paypal")).toMatchSnapshot();
        expect(hashStr("")).toMatchSnapshot();
    });
});
