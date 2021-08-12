export const loadCustomScript = jest.fn().mockImplementation(() => {
    window.braintree = {
        client: {
            create: jest.fn(),
        },
        paypalCheckout: {
            create: jest.fn().mockReturnValue({
                create: jest.fn(),
                tokenizePayment: jest.fn(),
                createPayment: jest.fn(),
            }),
        },
    };
    return Promise.resolve(window.braintree);
});

export const loadScript = jest.fn().mockImplementation(() => {
    window.paypal = {
        Buttons: jest.fn(() => ({
            close: jest.fn().mockResolvedValue(),
            isEligible: jest.fn().mockReturnValue(true),
            render: jest.fn().mockResolvedValue({}),
        })),
    };

    return Promise.resolve(window.paypal);
});
