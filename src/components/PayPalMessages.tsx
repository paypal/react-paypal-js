import React, { useEffect, useRef } from "react";
import { usePayPalScriptReducer } from "../ScriptContext";
import type { PayPalMessagesComponentProps } from "@paypal/paypal-js/types/components/messages";

interface PayPalMessagesReactProps extends PayPalMessagesComponentProps {
    forceReRender?: unknown
}

export default function PayPalMessages(props: PayPalMessagesReactProps) {
    const [{ isResolved }] = usePayPalScriptReducer();
    const messagesContainerRef = useRef(null);
    const messages = useRef(null);

    useEffect(() => {
        if (!isResolved) {
            return;
        }

        // @ts-expect-error - null checks
        messages.current = window.paypal.Messages({ ...props });

        // @ts-expect-error - null checks
        messages.current.render(messagesContainerRef.current).catch((err) => {
            console.error(
                `Failed to render <PayPalMessages /> component. ${err}`
            );
        });
        // eslint-disable-next-line react/prop-types
    }, [isResolved, props.forceReRender]);

    return <div ref={messagesContainerRef} />;
}
