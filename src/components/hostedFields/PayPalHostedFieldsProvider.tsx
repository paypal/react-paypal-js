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
    generateHostedFieldsFromChildren,
} from "./utils";
import { validateHostedFieldChildren } from "./validators";
import {
    PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION,
    SCRIPT_LOADING_STATE,
} from "../../types/enums";
import type { PayPalHostedFieldsComponentProps } from "../../types/payPalHostedFieldTypes";

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
export const PayPalHostedFieldsProvider: FC<PayPalHostedFieldsComponentProps> =
    ({ styles = defaultStyle, createOrder, children }) => {
        const childrenList = Children.toArray(children);
        const [{ options, loadingStatus }] = useScriptProviderContext();
        const [state, dispatch] = useReducer(payPalHostedFieldsReducer, {});
        const [isEligible, setIsEligible] = useState(true);
        const hostedFieldsContainerRef = useRef<HTMLDivElement>(null);
        const [, setErrorState] = useState(null);

        useEffect(() => {
            validateHostedFieldChildren(childrenList);
        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        useEffect(() => {
            // Only render the hosted fields when script is loaded and hostedFields is eligible
            if (!(loadingStatus === SCRIPT_LOADING_STATE.RESOLVED)) return;
            const hostedFields = decorateHostedFields({
                components: options.components,
                [DATA_NAMESPACE]: options[DATA_NAMESPACE],
            });

            if (!hostedFields.isEligible()) {
                return setIsEligible(false);
            }

            hostedFields
                .render({
                    // Call your server to set up the transaction
                    createOrder: createOrder,
                    styles: styles,
                    fields: generateHostedFieldsFromChildren(childrenList),
                })
                .then((cardFields) => {
                    dispatch({
                        type: PAYPAL_HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS,
                        value: cardFields,
                    });
                })
                .catch((err) => {
                    setErrorState(() => {
                        throw new Error(
                            `Failed to render <PayPalHostedFieldsProvider /> component. ${err}`
                        );
                    });
                });
        }, [loadingStatus, styles]); // eslint-disable-line react-hooks/exhaustive-deps

        return (
            <div ref={hostedFieldsContainerRef}>
                {isEligible && (
                    <PayPalHostedFieldsContext.Provider
                        value={{ ...state, dispatch }}
                    >
                        {children}
                    </PayPalHostedFieldsContext.Provider>
                )}
            </div>
        );
    };
