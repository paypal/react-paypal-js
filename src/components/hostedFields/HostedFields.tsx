import React, { useState, useEffect } from "react";
import type { FC } from "react";

import { usePayPalScriptReducer } from "../../hooks/scriptProviderHooks";
import { getPayPalWindowNamespace } from "../../utils";
import { DATA_NAMESPACE } from "../../constants";
import { throwMissingHostedFieldsError } from "./utils";

export const HostedFields: FC = () => {
    const [{ isResolved, options }] = usePayPalScriptReducer();
    const [isEligible, setIsEligible] = useState(true);

    useEffect(() => {
        const paypalWindowNamespace = getPayPalWindowNamespace(
            options[DATA_NAMESPACE]
        );

        // verify dependency on window object
        if (paypalWindowNamespace.HostedFields === undefined) {
            throwMissingHostedFieldsError({
                components: options.components,
                [DATA_NAMESPACE]: options[DATA_NAMESPACE],
            });
        }

        if (!paypalWindowNamespace.HostedFields?.isEligible()) {
            setIsEligible(false);
        }
    }, [options]);

    return (
        <div>
            <span>start using hosted fields</span>
        </div>
    );
};
