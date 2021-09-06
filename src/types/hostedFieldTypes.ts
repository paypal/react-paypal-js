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

export interface HostedFieldsComponentProps {
    showLabels: boolean;
    styles?: Record<string, unknown>;
    placeholder?: {
        number: string;
        cvv: string;
        expirationDate: string;
    };
    createOrder: () => Promise<string>;
}
