export enum SCRIPT_LOADING_STATE {
    INITIAL = "initial",
    PENDING = "pending",
    REJECTED = "rejected",
    RESOLVED = "resolved",
}

export enum DISPATCH_ACTION {
    LOADING_STATUS = "setLoadingStatus",
    RESET_OPTIONS = "resetOptions",
    SET_BRAINTREE_INSTANCE = "braintreeInstance",
}

export enum BraintreeErrorTypes {
    CUSTOMER = "CUSTOMER",
    MERCHANT = "MERCHANT",
    NETWORK = "NETWORK",
    INTERNAL = "INTERNAL",
    UNKNOWN = "UNKNOWN",
}

export enum FlowType {
    /**
     * Used to store the payment method for future use, ie subscriptions
     */
    Vault = "vault",

    /**
     * Used for one-time checkout
     */
    Checkout = "checkout",
}

export enum Intent {
    /**
     * Submits the transaction for authorization but not settlement.
     */
    Authorize = "authorize",

    /**
     * Validates the transaction without an authorization (i.e. without holding funds).
     * Useful for authorizing and capturing funds up to 90 days after the order has been placed.
     * Only available for Checkout flow.
     */
    Order = "order",

    /**
     * Payment will be immediately submitted for settlement upon creating a transaction.
     * `sale` can be used as an alias for this value.
     */
    Capture = "capture",
}

export enum ShippingOptionType {
    /**
     * The payer intends to receive the items at a specified address.
     */
    Shipping = "SHIPPING",

    /**
     * The payer intends to pick up the items at a specified address. For example, a store address.
     */
    Pickup = "PICKUP",
}

export enum LineItemKind {
    Debit = "debit",
    Credit = "credit",
}
