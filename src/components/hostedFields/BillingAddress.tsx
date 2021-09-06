import React from "react";
import type { FC } from "react";
import type { HostedFieldsBillingAddressProps } from "../../types/hostedFieldTypes";

const BillingAddress: FC<{
    billingAddress: HostedFieldsBillingAddressProps;
}> = ({ billingAddress }) => {
    const defaultBillingAddress = {
        ...{
            firstName: {
                show: false,
                label: "Name on card",
                placeholder: "First name",
            },
            lastName: {
                show: false,
                label: "Last Name on card",
                placeholder: "Last name",
            },
            company: {
                show: false,
                label: "Company",
                placeholder: "Company name",
            },
            streetAddress: {
                show: true,
                label: "Billing address",
                placeholder: "Street address",
            },
            extendedAddress: {
                show: true,
                label: "Billing address 2",
                placeholder: "Street address 2",
            },
            locality: { show: true, label: "City", placeholder: "City" },
            region: { show: true, label: "State", placeholder: "State/Region" },
            countryName: {
                show: false,
                label: "Country name",
                placeholder: "Country name",
            },
            countryCodeAlpha2: {
                show: true,
                label: "Country Alpha2 code",
                placeholder: "Country Alpha2 code",
            },
            countryCodeAlpha3: {
                show: false,
                label: "Country Alpha3 code",
                placeholder: "Country Alpha3 code",
            },
            countryCodeNumeric: {
                show: false,
                label: "Numeric country code",
                placeholder: "Numeric country code",
            },
            postalCode: {
                show: true,
                label: "ZIP",
                placeholder: "ZIP/Postal code",
            },
        },
        ...billingAddress,
    };

    return (
        <div>
            {(defaultBillingAddress.firstName.show || false) && (
                <div>
                    <label htmlFor="card-first-name">
                        {defaultBillingAddress.firstName.label}
                    </label>
                    <input
                        id="card-first-name"
                        type="text"
                        placeholder={
                            defaultBillingAddress.firstName.placeholder
                        }
                    />
                </div>
            )}
            {(billingAddress?.lastName?.show || true) && (
                <div>
                    <label htmlFor="card-last-name">
                        {defaultBillingAddress.lastName.label}
                    </label>
                    <input
                        id="card-last-name"
                        type="text"
                        placeholder={defaultBillingAddress.lastName.placeholder}
                    />
                </div>
            )}
            {defaultBillingAddress.company.show && (
                <div>
                    <label htmlFor="card-company-name">
                        {defaultBillingAddress.company.label}
                    </label>
                    <input
                        id="card-company-name"
                        type="text"
                        placeholder={defaultBillingAddress.company.placeholder}
                    />
                </div>
            )}
            {defaultBillingAddress.streetAddress.show && (
                <div>
                    <label htmlFor="card-street-one">
                        {defaultBillingAddress.streetAddress.label}
                    </label>
                    <input
                        id="card-street-one"
                        type="text"
                        placeholder={
                            defaultBillingAddress.streetAddress.placeholder
                        }
                    />
                </div>
            )}
            {defaultBillingAddress.extendedAddress.show && (
                <div>
                    <label htmlFor="card-street-two">
                        {defaultBillingAddress.extendedAddress.label}
                    </label>
                    <input
                        id="card-street-two"
                        type="text"
                        placeholder={
                            defaultBillingAddress.extendedAddress.placeholder
                        }
                    />
                </div>
            )}
            {defaultBillingAddress.locality.show && (
                <div>
                    <label htmlFor="card-city">
                        {defaultBillingAddress.locality.label}
                    </label>
                    <input
                        id="card-city"
                        type="text"
                        placeholder={defaultBillingAddress.locality.placeholder}
                    />
                </div>
            )}
            {defaultBillingAddress.region.show && (
                <div>
                    <label htmlFor="card-state">
                        {defaultBillingAddress.region.label}
                    </label>
                    <input
                        id="card-state"
                        type="text"
                        placeholder={defaultBillingAddress.region.placeholder}
                    />
                </div>
            )}
            {defaultBillingAddress.countryCodeAlpha2.show && (
                <div>
                    <label htmlFor="card-country">
                        {defaultBillingAddress.countryCodeAlpha2.label}
                    </label>
                    <input
                        id="card-country"
                        type="text"
                        placeholder={
                            defaultBillingAddress.countryCodeAlpha2.placeholder
                        }
                    />
                </div>
            )}
            {defaultBillingAddress.postalCode.show && (
                <div>
                    <label htmlFor="card-postal-code">
                        {defaultBillingAddress.postalCode.label}
                    </label>
                    <input
                        id="card-postal-code"
                        type="text"
                        placeholder={
                            defaultBillingAddress.postalCode.placeholder
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default BillingAddress;
