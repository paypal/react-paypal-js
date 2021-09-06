import type { PayPalHostedFieldsComponent } from "@paypal/paypal-js/types/components/hosted-fields";

export type HostedFieldsNamespace = {
    components: string | undefined;
    [DATA_NAMESPACE: string]: string | undefined;
};

export interface DecoratedPayPalHostedFieldsComponent
    extends PayPalHostedFieldsComponent {
    close(container: HTMLDivElement | null): void;
}

export interface HostedFieldProps {
    showLabel: boolean;
    label?: string;
}

export interface HostedFieldsBillingAddressProps {
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

export interface HostedFieldsBillingAddress {
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

export interface HostedFieldsComponentProps {
    showLabels: boolean;
    styles?: Record<string, unknown>;
    placeholder?: {
        number: string;
        cvv: string;
        expirationDate: string;
    };
    billingAddress: HostedFieldsBillingAddressProps;
    createOrder: () => Promise<string>;
}
