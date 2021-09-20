import { payPalHostedFieldsReducer } from "./payPalHostedFieldsContext";
import { PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION } from "../types/enums";

describe("PayPalHostedFieldsContext", () => {
    test("should return same state when action type is no not register", () => {
        const previousState = {
            a: 1,
            b: "hostedFields",
        };
        const result = payPalHostedFieldsReducer(previousState, {
            type: "",
            value: { c: true },
        });

        expect(result).toMatchObject(previousState);
    });

    test("should add cardFields instance to the context", () => {
        const cardFields = {
            submit: jest.fn(),
        };
        const result = payPalHostedFieldsReducer(
            {},
            {
                type: PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS,
                value: cardFields,
            }
        );

        expect(result).toMatchObject({
            cardFields: {
                submit: expect.any(Function),
            },
        });
    });
});
