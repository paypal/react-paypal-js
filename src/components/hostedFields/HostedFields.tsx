import React, { useState, useEffect, useRef } from "react";
import type { FC } from "react";

import { useScriptProviderContext } from "../../hooks/scriptProviderHooks";
import { DATA_NAMESPACE } from "../../constants";
import { decorateHostedFields, addHostedFieldStyles } from "./utils";
import CardNumber from "./CardNumber";
import CardVerificationValue from "./CardVerificationValue";
import ExpirationDate from "./ExpirationDate";
import BillingAddress from "./BillingAddress";
import SubmitButton from "./SubmitButton";
import { DISPATCH_ACTION, SCRIPT_LOADING_STATE } from "../../types";
import type { HostedFieldsComponentProps } from "../../types/hostedFieldTypes";

export const HostedFields: FC<HostedFieldsComponentProps> = ({
    showLabels = true,
    styles = {
        ".valid": {
            color: "#28A745",
        },
        ".invalid": {
            color: "#DC3545",
        },
    },
    billingAddress = { show: false },
    placeholder = { number: "", cvv: "", expirationDate: "" },
    createOrder,
}) => {
    const [{ options, hostedFields, loadingStatus }, dispatch] =
        useScriptProviderContext();
    const [isEligible, setIsEligible] = useState(true);
    const [styleResolved, setStyleResolved] = useState(false);
    const hostedFieldsContainerRef = useRef<HTMLDivElement>(null);
    const cardNumberRef = useRef<HTMLDivElement>(null);
    const cardVerificationValueRef = useRef<HTMLDivElement>(null);
    const cardExpirationDateRef = useRef<HTMLDivElement>(null);

    const submitOrder = () => {
        if (hostedFields) hostedFields.submit({});
    };

    useEffect(() => {
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
                fields: {
                    number: {
                        selector: `#${cardNumberRef.current?.id}`,
                        placeholder: placeholder.number,
                    },
                    cvv: {
                        selector: `#${cardVerificationValueRef.current?.id}`,
                        placeholder: placeholder.cvv,
                    },
                    expirationDate: {
                        selector: `#${cardExpirationDateRef.current?.id}`,
                        placeholder: placeholder.expirationDate,
                    },
                },
            })
            .then((cardFields) => {
                dispatch({
                    type: DISPATCH_ACTION.SET_HOSTED_FIELDS_INSTANCE,
                    value: cardFields,
                });
            });
    }, [loadingStatus]);

    return (
        <>
            {isEligible && styleResolved && (
                <div
                    ref={hostedFieldsContainerRef}
                    id="hosted-fields-container"
                >
                    <CardNumber ref={cardNumberRef} showLabel={showLabels} />
                    <CardVerificationValue
                        ref={cardVerificationValueRef}
                        showLabel={showLabels}
                    />
                    <ExpirationDate
                        ref={cardExpirationDateRef}
                        showLabel={showLabels}
                    />
                    {billingAddress.show && (
                        <BillingAddress billingAddress={billingAddress} />
                    )}
                    <SubmitButton clickHandler={submitOrder} />
                </div>
            )}
        </>
    );
};
