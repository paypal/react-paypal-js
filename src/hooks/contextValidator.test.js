import {
    contextNotEmptyValidator,
    contextOptionClientTokenNotEmptyValidator,
} from "./contextValidator";

describe("contextNotEmptyValidator", () => {
    test("should throw an exception with no args", () => {
        expect(() => {
            contextNotEmptyValidator();
        }).toThrowError(
            new Error(
                "usePayPalScriptReducer must be used within a PayPalScriptProvider"
            )
        );
    });

    test("should throw an exception with empty object not containing dispatch function", () => {
        expect(() => {
            contextNotEmptyValidator({});
        }).toThrowError(
            new Error(
                "usePayPalScriptReducer must be used within a PayPalScriptProvider"
            )
        );
    });

    test("should throw an exception with object containing dispatch as value not a function", () => {
        expect(() => {
            contextNotEmptyValidator({ dispatch: 10 });
        }).toThrowError(
            new Error(
                "usePayPalScriptReducer must be used within a PayPalScriptProvider"
            )
        );
    });

    test("should return same object if dispatch is a function", () => {
        const state = { dispatch: jest.fn() };
        expect(contextNotEmptyValidator(state)).toEqual(state);
    });
});

describe("contextOptionClientTokenNotEmptyValidator", () => {
    test("should throw an exception with no args", () => {
        expect(() => {
            contextOptionClientTokenNotEmptyValidator();
        }).toThrowError(
            new Error(
                "A client token wasn't found in the provider parent component"
            )
        );
    });

    test("should throw an exception with empty object as args", () => {
        expect(() => {
            contextOptionClientTokenNotEmptyValidator({});
        }).toThrowError(
            new Error(
                "A client token wasn't found in the provider parent component"
            )
        );
    });

    test("should throw an exception with data client token equals to null", () => {
        expect(() => {
            contextOptionClientTokenNotEmptyValidator({
                options: { "data-client-token": null },
            });
        }).toThrowError(
            new Error(
                "A client token wasn't found in the provider parent component"
            )
        );
    });

    test("should throw an exception with data client token equals to empty string", () => {
        expect(() => {
            contextOptionClientTokenNotEmptyValidator({
                options: { "data-client-token": "" },
            });
        }).toThrowError(
            new Error(
                "A client token wasn't found in the provider parent component"
            )
        );
    });

    test("should return object if data client token is a valid string", () => {
        const state = { options: { "data-client-token": "JKHFGDHJ657" } };
        expect(contextOptionClientTokenNotEmptyValidator(state)).toEqual(state);
    });
});
