import React, {
    useEffect,
    useRef,
    useState,
    ReactElement,
} from "react";
import { usePayPalScriptReducer } from "../ScriptContext";
import { getPayPalWindowNamespace, DEFAULT_PAYPAL_NAMESPACE } from "./utils";
import type {
    PayPalHostedFieldsComponentProps,
    PayPalHostedFieldsComponent,
    OnInitActions,
} from "@paypal/paypal-js/types/components/HostedFields";

export interface PayPalHostedFieldsProps extends PayPalHostedFieldsComponentProps {
    /**
     * Used to re-render the component.
     * Changes to this prop will destroy the existing HostedFields and render them again using the current props.
     */
     forceReRender?: unknown;
     /**
    /**
     * Pass a css class to the div container.
     */
    className?: string;
    /**
     * One of the main purpose of this component is to either render these children or not.
     * Note: Decided to leave the children non-optional, as it doesn't make sense that the component doesn't have children.
     */
    children: ReactElement
}
 
/**
 * This `<PayPalHostedFields />` component renders hosted-fields from the JS SDK
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * Use props for customizing your hosted-fields. For example, here's how you would use the `createOrder` options:
 *
 * ```jsx
 *     <PayPalHostedFields createOrder={(data, actions) => {}}>
 *      // card fields here
        // billing address here
 *     </PayPalHostedFields>
 * ```
 */

export const PayPalHostedFields: React.FunctionComponent<PayPalHostedFieldsProps> = ({className = "", forceReRender, children, ...hostedFieldsProps}) => {
    // const hostedFields = useRef<PayPalHostedFieldsComponent | null>(null);
    const hostedFields = useRef<any | null>(null);
    const [{ isResolved, options }] = usePayPalScriptReducer();
    const [initActions, setInitActions] = useState<OnInitActions | null>(null);
    const [isEligible, setIsEligible] = useState(true);
    const [, setErrorState] = useState(null);

    function closeHostedFieldsComponent() {
        if (hostedFields.current !== null) {
            hostedFields.current.close().catch(() => {
                // ignore errors when closing the component
            });
        }
    }

// useEffect hook for rendering the hosted-fields
useEffect(() => {
    // verify the sdk script has successfully loaded
    if (isResolved === false) {
        return closeHostedFieldsComponent;
    }

    // Make sure a client token is provided
    if (options["data-client-token"] === null) {
        return closeHostedFieldsComponent;
    } 

    const paypalWindowNamespace = getPayPalWindowNamespace(
        options["data-namespace"]
    );

    // verify dependency on window object
    if (
        paypalWindowNamespace === undefined ||
        paypalWindowNamespace.HostedFields === undefined
    ) {
        setErrorState(() => {
            throw new Error(getErrorMessage(options));
        });
        return closeHostedFieldsComponent;
    }

    const decoratedOnInit = (
        data: Record<string, unknown>,
        actions: OnInitActions
    ) => {
        setInitActions(actions);
        if (typeof hostedFieldsProps.onInit === "function") {
            hostedFieldsProps.onInit(data, actions);
        }
    };

    hostedFields.current = paypalWindowNamespace.HostedFields({
        ...hostedFieldsProps,
        onInit: decoratedOnInit,
    });

    // only render the button when eligible
    if (hostedFields.current.isEligible() === false) {
        setIsEligible(false);
        return closeHostedFieldsComponent;
    }

}, [isResolved, options["data-client-token"], forceReRender]);


    return ( <div className={className}>
        {children}
    </div> );
}

function getErrorMessage({
    components = "",
    "data-namespace": dataNamespace = DEFAULT_PAYPAL_NAMESPACE,
}) {
    let errorMessage = `Unable to render <PayPalHostedFields /> because window.${dataNamespace}.HostedFields is undefined.`;

    // the JS SDK does not include the HostedFields component by default when no 'components' are specified.
    // The 'hosted-fields' component must be included in the 'components' list when using it with other components.
    if (components.length && !components.includes("hosted-fields")) {
        const expectedComponents = `${components},hosted-fields`;

        errorMessage +=
            "\nTo fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider:" +
            `\n\`<PayPalScriptProvider options={{ components: '${expectedComponents}'}}>\`.`;
    }

    return errorMessage;
}