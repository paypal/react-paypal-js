import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalHostedFieldTypes";
import { concatClassName } from "./utils";
import { HOSTED_FIELDS_TYPES } from "../../types";

export const PayPalHostedField: FC<PayPalHostedFieldProps> = ({
    hostedFieldType,
    options,
    classes = ["card_field"],
    style = {},
}) => {
    return (
        <>
            {hostedFieldType === HOSTED_FIELDS_TYPES.CUSTOM ? (
                <input type="text" />
            ) : (
                <div
                    className={`${options.selector}${concatClassName(
                        classes,
                        true
                    )}`}
                    style={style}
                ></div>
            )}
        </>
    );
};
