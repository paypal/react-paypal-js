import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalhostedFieldTypes";
import { concatClassName } from "./utils";
import { HOSTED_FIELDS_TYPES } from "../../types";

export const PayPalHostedField: FC<PayPalHostedFieldProps> = ({
    identifier,
    type,
    classes = ["card_field"],
    style = {},
}) => {
    return (
        <>
            {type === HOSTED_FIELDS_TYPES.CUSTOM ? (
                <input type="text" />
            ) : (
                <div
                    className={`${identifier}${concatClassName(classes, true)}`}
                    style={style}
                ></div>
            )}
        </>
    );
};
