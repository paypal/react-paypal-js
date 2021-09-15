import React, {
    useState,
    useEffect,
    useRef,
    useReducer,
    Children,
} from "react";
import type { FC } from "react";

import {
    PayPalHostedFieldsContext,
    payPalHostedFieldsReducer,
} from "../../context/payPalHostedFieldsContext";
import { useScriptProviderContext } from "../../hooks/scriptProviderHooks";
import { DATA_NAMESPACE } from "../../constants";
import {
    decorateHostedFields,
    addHostedFieldStyles,
    getHostedFieldsFromChildren,
} from "./utils";
import { validateHostedFieldChildren } from "./validators";
import {
    PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION,
    PAYPAL_HOSTED_FIELDS_TYPES,
    SCRIPT_LOADING_STATE,
} from "../../types/enums";
import type { PayPalHostedFieldsComponentProps } from "../../types/payPalHostedFieldTypes";

// Required hosted fields inside the provider
const requiredChildren = [
    PAYPAL_HOSTED_FIELDS_TYPES.NUMBER,
    PAYPAL_HOSTED_FIELDS_TYPES.CVV,
    PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE,
];
// HostedFields namespace supported elements
const optionalChildren = [
    PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH,
    PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_YEAR,
    PAYPAL_HOSTED_FIELDS_TYPES.POSTAL_CODE,
];

const defaultStyle = {
    ".valid": {
        color: "#28A745",
    },
    ".invalid": {
        color: "#DC3545",
    },
};
/**
 * TODO: Finish the documentation similar to PayPalButtons
 *
 * @param param0
 * @returns
 */
export const PayPalHostedFieldsForm: FC<PayPalHostedFieldsComponentProps> = ({
    styles = defaultStyle,
    createOrder,
    children,
}) => {
    const childrenList = Children.toArray(children);
    const [{ options, loadingStatus }] = useScriptProviderContext();
    const [state, dispatch] = useReducer(payPalHostedFieldsReducer, {
        dispatch: () => null,
    });
    const [isEligible, setIsEligible] = useState(true);
    const [styleResolved, setStyleResolved] = useState(false);
    const hostedFieldsContainerRef = useRef<HTMLDivElement>(null);
    const [, setErrorState] = useState(null);

    useEffect(() => {
        validateHostedFieldChildren(childrenList, requiredChildren);

        const linkElement = addHostedFieldStyles();
        setStyleResolved(true);
        // Clean the style from DOM after component unmount
        return () => linkElement.remove();
    }, []);

    useEffect(() => {
        if (
            !(loadingStatus === SCRIPT_LOADING_STATE.RESOLVED) ||
            !setStyleResolved
        )
            return;
        const hostedFields = decorateHostedFields({
            components: options.components,
            [DATA_NAMESPACE]: options[DATA_NAMESPACE],
        });

        // Only render the hosted fields when eligible
        if (!hostedFields.isEligible()) {
            setIsEligible(false);
            hostedFields.close(hostedFieldsContainerRef.current);
        }

        hostedFields
            .render({
                // Call your server to set up the transaction
                createOrder: createOrder,
                styles: styles,
                fields: getHostedFieldsFromChildren(childrenList, [
                    ...requiredChildren,
                    ...optionalChildren,
                ]),
            })
            .then((cardFields) => {
                dispatch({
                    type: PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS,
                    value: cardFields,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingStatus, styles]);

    return (
        <>
            {isEligible && styleResolved && (
                <PayPalHostedFieldsContext.Provider
                    value={{ ...state, dispatch }}
                >
                    {children}
                </PayPalHostedFieldsContext.Provider>
            )}
        </>
    );
};
