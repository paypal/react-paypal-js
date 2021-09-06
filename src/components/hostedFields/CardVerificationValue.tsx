import React, { forwardRef } from "react";
import type { ForwardRefRenderFunction } from "react";

import type { HostedFieldProps } from "../../types/hostedFieldTypes";

const CardVerificationValue: ForwardRefRenderFunction<
    HTMLDivElement,
    HostedFieldProps
> = ({ label = "CVV", showLabel = true }, ref) => {
    return (
        <div>
            {showLabel && <label htmlFor="cvv">{label}</label>}
            <div id="cvv" className="card_field" ref={ref}></div>
        </div>
    );
};

export default forwardRef<HTMLDivElement, HostedFieldProps>(
    CardVerificationValue
);
