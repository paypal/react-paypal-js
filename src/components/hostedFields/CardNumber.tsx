import React, { forwardRef } from "react";
import type { ForwardRefRenderFunction } from "react";

import type { HostedFieldProps } from "../../types/hostedFieldTypes";

const CardNumber: ForwardRefRenderFunction<HTMLDivElement, HostedFieldProps> = (
    { label = "Card Number", showLabel = true },
    ref
) => {
    return (
        <div>
            {showLabel && <label htmlFor="card-number">{label}</label>}
            <div id="card-number" className="card_field" ref={ref}></div>
        </div>
    );
};

export default forwardRef<HTMLDivElement, HostedFieldProps>(CardNumber);
