import { Children } from "react";
import { PayPalHostedField } from "./PayPalHostedField";
import { DEFAULT_PAYPAL_NAMESPACE, SDK_SETTINGS } from "../../constants";

import { PAYPAL_HOSTED_FIELDS_TYPES } from "../../types";
import type {
    ReactChild,
    ReactFragment,
    ReactPortal,
    ReactElement,
    FC,
} from "react";
import type {
    PayPalHostedFieldsNamespace,
    PayPalHostedFieldProps,
    PayPalHostedFieldOptions,
} from "../../types/payPalHostedFieldTypes";
import type { ReactNode, JSXElementConstructor } from "react";

// Define the type of the fields object use in the HostedFields.render options
type PayPalHostedFieldOption = {
    [key: string]: PayPalHostedFieldOptions;
};

/**
 * Throw an exception if the HostedFields is not found in the paypal namespace
 * Probably cause for this problem is not sending the hosted-fields string
 * as part of the components props in options
 * {@code <PayPalScriptProvider options={{ components: 'hosted-fields'}}>}
 *
 * @param param0 and object containing the components and namespace defined in options
 * @throws {@code Error}
 *
 */
export const generateMissingHostedFieldsError = ({
    components = "",
    [SDK_SETTINGS.DATA_NAMESPACE]: dataNamespace = DEFAULT_PAYPAL_NAMESPACE,
}: PayPalHostedFieldsNamespace): string => {
    const expectedComponents = components
        ? `${components},hosted-fields`
        : "hosted-fields";
    let errorMessage = `Unable to render <PayPalHostedFieldsProvider /> because window.${dataNamespace}.HostedFields is undefined.`;

    if (!components.includes("hosted-fields")) {
        errorMessage += `\nTo fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider: <PayPalScriptProvider options={{ components: '${expectedComponents}'}}>`;
    }

    return errorMessage;
};

/**
 * Identify all the valid hosted fields children and generate the valid options
 * to use in the HostedFields.render process
 *
 * @param childrenList     the list of children received
 * @param possibleChildren a list of child type to transform into fields format
 * @returns the fields object required to render the HostedFields
 */
export const generateHostedFieldsFromChildren = (
    childrenList: (ReactChild | ReactPortal | ReactFragment)[]
): PayPalHostedFieldOption =>
    childrenList.reduce<PayPalHostedFieldOption>((fields, child) => {
        const {
            props: { hostedFieldType, options },
        } = child as ReactElement<PayPalHostedFieldProps, FC>;

        if (
            (Object.values(PAYPAL_HOSTED_FIELDS_TYPES) as string[]).includes(
                hostedFieldType
            )
        ) {
            fields[hostedFieldType] = {
                selector: options.selector,
                placeholder: options.placeholder,
                type: options.type,
                formatInput: options.formatInput,
                maskInput: options.maskInput,
                select: options.select,
                maxlength: options.maxlength,
                minlength: options.minlength,
                prefill: options.prefill,
                rejectUnsupportedCards: options.rejectUnsupportedCards,
            };
        }
        return fields;
    }, {});

/**
 * Search for a specific type component in a list of children components.
 * The search will be executed recursively over all the deepness of each child in the list.
 * This allows founding a child deeper in the JSX declaration.
 *
 * @since 7.5.1
 * @param childrenList the source children list to execute teh filter process
 * @param result       an optional array reference to add found children
 * @param typeName     the type name criteria to make the search
 * @returns a list with found components in the children hierarchy
 */
export const deepFilterChildren = (
    children: ReactNode | ReactNode[],
    result: (ReactChild | ReactPortal | ReactFragment)[] = [],
    typeName: string = PayPalHostedField.name
): (ReactChild | ReactPortal | ReactFragment)[] => {
    Children.toArray(children).forEach((child) => {
        if (typeof (child as ReactElement)?.props?.children === "object") {
            deepFilterChildren(
                (child as ReactElement).props?.children,
                result,
                typeName
            );
        }

        if (
            (child as ReactElement<PayPalHostedFieldProps, FC>)?.type?.name ===
            typeName
        ) {
            result.push(child);
        }
    });

    return result;
};
