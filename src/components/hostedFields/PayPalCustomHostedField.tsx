import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalHostedFieldTypes";
import { concatClassName } from "./utils";

export const PayPalCustomHostedField: FC<PayPalHostedFieldProps> = ({
    classes = ["card_field"],
    style = {},
}) => {
    return (
        <div className={concatClassName(classes)} style={style}>
            <label></label>
            <input type="text" />
        </div>
    );
};
