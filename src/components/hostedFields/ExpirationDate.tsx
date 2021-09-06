import React, { forwardRef } from "react";
import type { ForwardRefRenderFunction } from "react";

import type { HostedFieldProps } from "../../types/hostedFieldTypes";

const ExpirationDate: ForwardRefRenderFunction<
    HTMLDivElement,
    HostedFieldProps
> = ({ label = "Expiration Date", showLabel = true }, ref) => {
    return (
        <div>
            {showLabel && <label htmlFor="expiration-date">{label}</label>}
            <div id="expiration-date" className="card_field" ref={ref}></div>
        </div>
    );
};

export default forwardRef<HTMLDivElement, HostedFieldProps>(ExpirationDate);
