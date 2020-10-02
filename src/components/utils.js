export function standardizeFundingSource(fundingSource) {
    // support either key or value for funding source
    // for example, both "PAYPAL" and "paypal" are valid
    if (window?.paypal?.FUNDING[fundingSource]) {
        return window.paypal.FUNDING[fundingSource];
    }

    return fundingSource;
}
