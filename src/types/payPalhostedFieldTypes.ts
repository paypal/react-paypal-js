import type {
    HostedFieldsHandler,
    PayPalHostedFieldsComponent,
} from "@paypal/paypal-js/types/components/hosted-fields";

import { HOSTED_FIELDS_DISPATCH_ACTION, HOSTED_FIELDS_TYPES } from "./enums";

export type PayPalHostedFieldsNamespace = {
    components: string | undefined;
    [DATA_NAMESPACE: string]: string | undefined;
};

export interface DecoratedPayPalHostedFieldsComponent
    extends PayPalHostedFieldsComponent {
    close(container: HTMLDivElement | null): void;
}

export interface PayPalHostedFieldProps {
    identifier: string;
    type: HOSTED_FIELDS_TYPES;
    classes?: string[];
    style?: Record<string, string>;
}

export interface PayPalHostedFieldsBillingAddressProps {
    show: boolean;
    firstName?: { show: boolean; label: string; placeholder: string };
    lastName?: { show: boolean; label: string; placeholder: string };
    company?: { show: boolean; label: string; placeholder: string };
    streetAddress?: { show: boolean; label: string; placeholder: string };
    extendedAddress?: { show: boolean; label: string; placeholder: string };
    locality?: { show: boolean; label: string; placeholder: string };
    region?: { show: boolean; label: string; placeholder: string };
    countryName?: { show: boolean; label: string; placeholder: string };
    countryCodeAlpha2?: { show: boolean; label: string; placeholder: string };
    countryCodeAlpha3?: { show: boolean; label: string; placeholder: string };
    countryCodeNumeric?: { show: boolean; label: string; placeholder: string };
    postalCode?: { show: boolean; label: string; placeholder: string };
}

export interface PayPalHostedFieldsBillingAddress {
    firstName?: string;
    lastName?: string;
    company?: string;
    streetAddress?: string;
    extendedAddress?: string;
    locality?: string;
    region?: string;
    // passing just one of the country options is sufficient to
    // associate the card details with a particular country
    // valid country names and codes can be found here:
    // https://developers.braintreepayments.com/reference/general/countries/ruby#list-of-countries
    countryName?: string;
    countryCodeAlpha2?: string;
    countryCodeAlpha3?: string;
    countryCodeNumeric?: string;
    postalCode?: string;
}

export type DefaultPayPalHostedFields = {
    [key in keyof HOSTED_FIELDS_TYPES]?: { selector: string };
};

export interface PayPalHostedFieldsComponentProps {
    createOrder: () => Promise<string>;
    children: React.ReactNode;
    styles?: Record<string, unknown>;
}

export type PayPalHostedFieldsAction = {
    type: `${HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS}`;
    value: HostedFieldsHandler;
};

export interface PayPalHostedFieldsContextState {
    cardFields?: HostedFieldsHandler;
    dispatch: React.Dispatch<PayPalHostedFieldsAction>;
}
