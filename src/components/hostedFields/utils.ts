import { DEFAULT_PAYPAL_NAMESPACE, DATA_NAMESPACE } from "../../constants";

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
}: {
    components: string | undefined;
    [DATA_NAMESPACE: string]: string | undefined;
}): never => {
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
