import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalhostedFieldTypes";
import { concatClassName } from "./utils";
import { HOSTED_FIELDS_TYPES } from "../../types";

export const PayPalCustomHostedField: FC<PayPalHostedFieldProps> = ({
    identifier,
    type,
    classes = ["card_field"],
    style = {},
}) => {
    return (
        <div className={concatClassName(classes)}>
            <label></label>
            <input type="text" />
        </div>
    );
};
