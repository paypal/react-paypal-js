import { DEFAULT_PAYPAL_NAMESPACE, DATA_NAMESPACE } from "../../constants";
import { getPayPalWindowNamespace } from "../../utils";

import { HOSTED_FIELDS_TYPES } from "../../types";
import type { PayPalHostedFieldsComponent } from "@paypal/paypal-js/types/components/hosted-fields";
import type {
    PayPalHostedFieldsNamespace,
    DecoratedPayPalHostedFieldsComponent,
    DefaultPayPalHostedFields,
} from "../../types/payPalhostedFieldTypes";
import type {
    ReactChild,
    ReactFragment,
    ReactPortal,
    ReactElement,
} from "react";

/**
 * Throw and exception if the HostedFields is not found in the paypal namespace
 * Probably cause for this problem is not sending the hosted-fields string
 * as part of the components props in options
 * {@code <PayPalScriptProvider options={{ components: 'hosted-fields'}}>}
 *
 * @param param0 and object containing the components and namespace defined in options
 * @throws {@code Error}
 *
 */
export const throwMissingHostedFieldsError = ({
    components = "",
    [DATA_NAMESPACE]: dataNamespace = DEFAULT_PAYPAL_NAMESPACE,
}: PayPalHostedFieldsNamespace): never => {
    const errorMessage = `Unable to render <HostedFields /> because window.${dataNamespace}.HostedFields is undefined.
    ${
        components.includes("hosted-fields")
            ? ""
            : `To fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider:
        <PayPalScriptProvider options={{ components: '${components},hosted-fields'}}>`
    }
    `;

    throw new Error(errorMessage);
};

/**
 * Decorate the HostedFields object in the window with a close custom method
 *
 * @param options scriptProvider options to get the HostedFields dependency
 * @returns the modified HostedFields object
 */
export const decorateHostedFields = (
    options: PayPalHostedFieldsNamespace
): DecoratedPayPalHostedFieldsComponent => {
    const hostedFields = getPayPalWindowNamespace(
        options[DATA_NAMESPACE]
    ).HostedFields;
    // check if the hosted fields are available in PayPal namespace
    if (hostedFields == null) throwMissingHostedFieldsError(options);

    return {
        ...(hostedFields as PayPalHostedFieldsComponent),
        close(container) {
            if (container != null) {
                container.querySelectorAll("*").forEach((element) => {
                    element.remove();
                });
            }
        },
    };
};

/**
 * Add HostedFields styles into the DOM
 *
 * @returns the link created and attached element
 */
export const addHostedFieldStyles = (): HTMLLinkElement => {
    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute(
        "href",
        "https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css"
    );

    return document.head.appendChild(linkElement);
};

/**
 * Utility function to concat hosted fields component classNames.
 * Here we include the identifier to avoid using references
 * in the render process of the hosted fields
 *
 * @param classes      a list of classes
 * @param initialSpace add space at the beginning
 * @returns all the classes contact by space
 */
export const concatClassName = (
    classes: string[],
    initialSpace = false
): string => {
    if (classes.length === 0) return "";
    const joinedClasses = classes.join(" ");

    return initialSpace ? ` ${joinedClasses}` : joinedClasses;
};

export const getHostedFieldsFromChildren = (
    childrenList: (ReactChild | ReactPortal | ReactFragment)[],
    requiredChildren: HOSTED_FIELDS_TYPES[]
): DefaultPayPalHostedFields => {
    return childrenList.reduce<DefaultPayPalHostedFields>((fields, child) => {
        const {
            props: { type, identifier },
        } = child as ReactElement;

        if (requiredChildren.includes(type)) {
            fields[type] = {
                selector: `.${identifier}`,
            };
        }
        return fields;
    }, {});
};
