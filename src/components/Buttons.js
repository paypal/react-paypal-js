import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useScriptReducer } from "../ScriptContext";

export default function CheckoutButtons(props) {
    const [{ isLoaded }] = useScriptReducer();
    const buttonsContainerRef = useRef(null);
    const buttons = useRef(null);

    useEffect(() => {
        if (isLoaded) {
            const { createOrder, style } = props;
            const options = { createOrder, style };
            buttons.current = window.paypal.Buttons(options);
            buttons.current.render(buttonsContainerRef.current);
        } else {
            // close the buttons when the script is reloaded
            if (buttons.current) {
                buttons.current.close();
            }
        }
        return () => {
            // close the buttons when the component unmounts
            if (buttons.current) {
                buttons.current.close();
            }
        };
    });

    return <div id="paypal-buttons" ref={buttonsContainerRef} />;
}

CheckoutButtons.propTypes = {
    createOrder: PropTypes.func,
    style: PropTypes.object,
};
