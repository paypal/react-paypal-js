import React, {
    useState,
    useEffect,
    useRef,
    useReducer,
    Children,
    ReactChild,
} from "react";
import type { FC, ReactElement } from "react";

import {
    PayPalHostedFieldsContext,
    payPalHostedFieldsReducer,
} from "../../context/payPalHostedFieldsContext";
import { useScriptProviderContext } from "../../hooks/scriptProviderHooks";
import { DATA_NAMESPACE } from "../../constants";
import { decorateHostedFields, addHostedFieldStyles } from "./utils";
import {
    HOSTED_FIELDS_DISPATCH_ACTION,
    HOSTED_FIELDS_TYPES,
    SCRIPT_LOADING_STATE,
} from "../../types";
import type {
    PayPalHostedFieldsComponentProps,
    PayPalHostedFieldProps,
    DefaultPayPalHostedFields,
} from "../../types/payPalhostedFieldTypes";

export const PayPalHostedFields: FC<PayPalHostedFieldsComponentProps> = ({
    styles = {
        ".valid": {
            color: "#28A745",
        },
        ".invalid": {
            color: "#DC3545",
        },
    },
    createOrder,
    children,
}) => {
    const childrenList = Children.toArray(children);
    const requiredChildren = [
        HOSTED_FIELDS_TYPES.NUMBER,
        HOSTED_FIELDS_TYPES.CVV,
        HOSTED_FIELDS_TYPES.EXPIRATION_DATE,
    ];
    const [{ options, loadingStatus }] = useScriptProviderContext();
    const [state, dispatch] = useReducer(payPalHostedFieldsReducer, {
        dispatch: () => null,
    });
    const [isEligible, setIsEligible] = useState(true);
    const [styleResolved, setStyleResolved] = useState(false);
    const hostedFieldsContainerRef = useRef<HTMLDivElement>(null);
    const cardNumberRef = useRef<HTMLDivElement>(null);
    const cardVerificationValueRef = useRef<HTMLDivElement>(null);
    const cardExpirationDateRef = useRef<HTMLDivElement>(null);
    const [, setErrorState] = useState(null);

    // const submitOrder = () => {
    //     if (hostedFields) {
    //         hostedFields.submit({
    //             cardholderName: "John Doe",
    //             billingAddress: {
    //                 countryCodeAlpha2: "US"
    //             }
    //         }).then(data => onApprove(data))
    //         .catch(err => {
    //             setErrorState(() => {
    //                 throw new Error("Cannot process the payment: " + err.message);
    //             });
    //         });
    //     }
    // };

    useEffect(() => {
        const registerTypes = childrenList.map(
            (child) => (child as ReactElement).props.type
        );

        if (!requiredChildren.every((type) => registerTypes.includes(type))) {
            throw new Error(
                "To use HostedFields you must use it with at least 3 children with types: [number, cvv, expirationDate] includes"
            );
        }

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

        childrenList.reduce<DefaultPayPalHostedFields>((acc, child) => {
            const castChild = child as ReactElement<
                PayPalHostedFieldProps,
                FC<PayPalHostedFieldProps>
            >;

            if (requiredChildren.includes(castChild.props.type)) {
                acc[castChild.props.type] = {
                    selector: `.${castChild.props.identifier}`,
                };
            }
            return acc;
        }, {});

        console.log(
            childrenList.reduce<DefaultPayPalHostedFields>((acc, child) => {
                const castChild = child as ReactElement<
                    PayPalHostedFieldProps,
                    FC<PayPalHostedFieldProps>
                >;

                if (requiredChildren.includes(castChild.props.type)) {
                    acc[castChild.props.type] = {
                        selector: `.${castChild.props.identifier}`,
                    };
                }
                return acc;
            }, {})
        );
        // {
        //     number: {
        //         selector: cardNumberRef.current,
        //     },
        //     cvv: {
        //         selector: `#${cardVerificationValueRef.current?.id}`,
        //     },
        //     expirationDate: {
        //         selector: `#${cardExpirationDateRef.current?.id}`,
        //     },
        // }
        hostedFields
            .render({
                // Call your server to set up the transaction
                createOrder: createOrder,
                styles: styles,
                fields: {
                    number: {
                        selector: ".card-number",
                    },
                    cvv: {
                        selector: ".cvv",
                    },
                    expirationDate: {
                        selector: ".expiration-date",
                    },
                },
            })
            .then((cardFields) => {
                dispatch({
                    type: HOSTED_FIELDS_DISPATCH_ACTION.SET_CARD_FIELDS,
                    value: cardFields,
                });
            });
    }, [loadingStatus]);

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
