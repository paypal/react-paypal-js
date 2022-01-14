import { BraintreePayPalCheckout } from "./../../types/braintree/paypalCheckout";
import { BraintreeNamespace } from "./../../types/braintreePayPalButtonTypes";
import { waitFor } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { getBraintreeLoader } from "./braintreeLoadStrategy";

jest.mock("@paypal/paypal-js", () => ({
    loadCustomScript: jest.fn(),
}));

type WindowBraintree = Window &
    typeof global & { braintree: BraintreeNamespace };

type WindowDefine = Window &
    typeof globalThis & {
        define: () => void;
    } & { define: { amd: unknown } };

type WindowRequire =
    | (Window & typeof globalThis)
    | {
          require: (
              dependencies: string[],
              load: (...args: unknown[]) => void,
              error: (err: Error) => void
          ) => void;
      };

describe("getBraintreeLoader", () => {
    test("should get the braintree namespace from global context", async () => {
        const braintreeNamespace = mock<BraintreeNamespace>();
        (window as WindowBraintree).braintree = braintreeNamespace;

        waitFor(() =>
            expect(getBraintreeLoader()).toMatchObject(braintreeNamespace)
        );
    });

    test("should get the braintree namespace from AMD modules", async () => {
        const braintreeNamespace = mock<BraintreeNamespace>();
        const braintreePaypalCheckout = mock<BraintreePayPalCheckout>();
        const defineMock = () => {
            return;
        };

        defineMock.amd = {};
        (window as WindowDefine).define = defineMock;
        (window as WindowRequire).require = (
            dependencies: string[],
            success: (
                braintree: BraintreeNamespace,
                braintreeCheckout: BraintreePayPalCheckout
            ) => void
        ) => {
            return success(braintreeNamespace, braintreePaypalCheckout);
        };

        waitFor(() =>
            expect(getBraintreeLoader()).toMatchObject(braintreeNamespace)
        );
    });

    test("should throw and error the braintree namespace from AMD modules", async () => {
        const errorMock = new Error("Unexpected error");
        const defineMock = () => {
            return;
        };

        defineMock.amd = {};
        (window as WindowDefine).define = defineMock;
        (window as WindowRequire).require = (
            dependencies: string[],
            success: (
                braintree: BraintreeNamespace,
                braintreeCheckout: BraintreePayPalCheckout
            ) => void,
            error: (err: Error) => void
        ) => {
            return error(errorMock);
        };

        try {
            await getBraintreeLoader();
        } catch (err) {
            expect(err).toBe(errorMock);
        }
    });
});
