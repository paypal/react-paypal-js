import React, { useEffect, useRef } from "react";
import { usePayPalScriptReducer } from "../ScriptContext";

export default function PayPalMessages(props) {
    const [{ loadingStatus }] = usePayPalScriptReducer();
    const messagesContainerRef = useRef(null);
    const messages = useRef(null);

    useEffect(() => {
        if (loadingStatus !== "resolved") {
            return;
        }

        messages.current = window.paypal.Messages({ ...props });

        messages.current.render(messagesContainerRef.current).catch((err) => {
            console.error(
                `Failed to render <PayPalMessages /> component. ${err}`
            );
        });
    });

    return <div ref={messagesContainerRef} />;
}
