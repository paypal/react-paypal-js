import { SDK_QUERY_KEYS } from "@paypal/sdk-constants/dist/module";

const CLIENT_TOKEN_URL =
    "http://braintree-sdk-demo.herokuapp.com/api/braintree/auth";
const allowedSDKQueryParams = Object.keys(SDK_QUERY_KEYS).map(
    (key) => SDK_QUERY_KEYS[key]
);

// paypal-js supports the sdkBaseURL param for testing in lower environments
allowedSDKQueryParams.push("sdkBaseURL");

export function getOptionsFromQueryString(): Record<string, string> {
    const searchParams = new URLSearchParams(window.location.search);
    const validOptions: Record<string, string> = {};

    searchParams.forEach((value, key) => {
        if (allowedSDKQueryParams.includes(key)) {
            validOptions[key] = value;
        }
    });

    return validOptions;
}

export async function getClientToken(): Promise<string> {
    const response: { clientToken: string; success: boolean } = await (
        await fetch(CLIENT_TOKEN_URL)
    ).json();

    return response?.clientToken;
}

export function generateRandomString(): string {
    return `uid_${Math.random().toString(36).substring(7)}`;
}
