import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalhostedFieldTypes";
import { concatClassName } from "./utils";

export const PayPalHostedField: FC<PayPalHostedFieldProps> = ({
    identifier,
    classes = [],
    style = {},
}) => {
    return (
        <div
            className={`${identifier}${concatClassName(classes, true)}`}
            style={style}
        ></div>
    );
};
