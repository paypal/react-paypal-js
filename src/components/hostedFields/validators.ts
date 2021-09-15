import type {
    ReactChild,
    ReactFragment,
    ReactPortal,
    ReactElement,
} from "react";

import { PAYPAL_HOSTED_FIELDS_TYPES } from "../../types";
import { PayPalHostedField } from "./PayPalHostedField";

const hasDefaultChildren = (
    requiredChildren: PAYPAL_HOSTED_FIELDS_TYPES[],
    registerTypes: PAYPAL_HOSTED_FIELDS_TYPES[]
) => {
    if (!requiredChildren.every((type) => registerTypes.includes(type))) {
        throw new Error(
            "To use HostedFields you must use it with at least 3 children with types: [number, cvv, expirationDate] includes"
        );
    }
};

const notDuplicateChildren = (registerTypes: PAYPAL_HOSTED_FIELDS_TYPES[]) => {
    if (registerTypes.length !== new Set(registerTypes).size) {
        throw new Error("Cannot use duplicate HostedFields as children");
    }
};

const notCombinableExpirationDate = (
    registerTypes: PAYPAL_HOSTED_FIELDS_TYPES[]
) => {
    if (
        registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE) &&
        (registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH) ||
            registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_YEAR))
    ) {
        throw new Error(
            `Cannot use the expirationDate field in combination with expirationMonth and expirationYear.
            You should use expirationDate or combine expirationMonth and expirationYear`
        );
    }
};

export const validateHostedFieldChildren = (
    childrenList: (ReactChild | ReactFragment | ReactPortal)[],
    requiredChildren: PAYPAL_HOSTED_FIELDS_TYPES[]
): void => {
    const registerTypes = childrenList
        .filter((child) => child instanceof PayPalHostedField)
        .map(
            (child) =>
                (child as ReactElement).props
                    .hostedFieldType as PAYPAL_HOSTED_FIELDS_TYPES
        );

    hasDefaultChildren(requiredChildren, registerTypes);
    notDuplicateChildren(registerTypes);
    notCombinableExpirationDate(registerTypes);
};
