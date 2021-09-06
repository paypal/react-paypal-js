import React from "react";
import type { FC } from "react";

const SubmitButton: FC<{
    clickHandler: () => void;
}> = ({ clickHandler }) => {
    return (
        <div>
            <button onClick={clickHandler}>Pay</button>
        </div>
    );
};

export default SubmitButton;
