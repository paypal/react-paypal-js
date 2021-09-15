import React from "react";
import type { FC } from "react";

import type { PayPalHostedFieldProps } from "../../types/payPalHostedFieldTypes";
import { concatClassName } from "./utils";

/**
 * React functional component to create a specific hosted fields
 * Available hosted fields are @enum {PAYPAL_HOSTED_FIELDS_TYPES}
 *
 * @param param0
 * @returns
 */
export const PayPalHostedField: FC<PayPalHostedFieldProps> = ({
    options,
    classes = ["card_field"],
    style = {},
}) => {
    return (
        <div
            className={`${options.selector}${concatClassName(classes, true)}`}
            style={style}
        />
    );
};
