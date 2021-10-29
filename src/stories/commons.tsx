import React, { FC } from "react";
import { action } from "@storybook/addon-actions";
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";
import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    CURRENT_SELECTION,
} from "@storybook/addon-docs";
import dedent from "ts-dedent";

import { ERROR, SDK } from "./constants";

/**
 * Functional component to render a custom ineligible error UI
 */
export const InEligibleError: FC<{ text?: string }> = ({ text }) => (
    <h3 style={{ color: "#dc3545", textTransform: "capitalize" }}>
        {text || "The component is ineligible to render"}
    </h3>
);

export const defaultProps = {
    onInit(): void {
        action(SDK)("Library initialized and rendered");
    },
    onClick(): void {
        action("button")(
            "Click event dispatch from the the PayPal payment button"
        );
    },
    onError(err: Record<string, unknown>): void {
        action(ERROR)(err.toString());
    },
    onCancel(): void {
        action("payment")("The payment process was cancel");
    },
};

export const generateDocPageStructure = (code: string): JSX.Element => (
    <>
        <Title />
        <Subtitle />
        <Description />
        <Sandpack
            template="react"
            files={{
                "/App.js": dedent`${code}`,
                "/styles.css": {
                    code: dedent`body {
                        font-family: sans-serif;
                        -webkit-font-smoothing: auto;
                        -moz-font-smoothing: auto;
                        -moz-osx-font-smoothing: grayscale;
                        font-smoothing: auto;
                        text-rendering: optimizeLegibility;
                        font-smooth: always;
                        -webkit-tap-highlight-color: transparent;
                        -webkit-touch-callout: none;
                    }
                    
                    .card-field {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-sizing: border-box;
                        margin-top: 6px;
                        margin-bottom: 16px;
                        resize: vertical;
                        height: 40px;
                        background: white;
                        font-size: 17px;
                        color: #3a3a3a;
                        font-family: helvetica, tahoma, calibri, sans-serif;
                    }

                    .btn {
                        display: inline-block;
                        font-weight: 400;
                        text-align: center;
                        white-space: nowrap;
                        vertical-align: middle;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        border: 1px solid transparent;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        line-height: 1.5;
                        border-radius: 0.25rem;
                        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
                            border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        cursor: pointer;
                    }
                
                    .btn-primary {
                        color: #fff;
                        background-color: #007bff;
                        border-color: #007bff;
                    }

                    .mark {
                        display: flex;
                        align-items: center;
                    }
                    .spinner {
                        display: inline-block;
                        height: 40px;
                        width: 40px;
                        box-sizing: border-box;
                        border: 3px solid rgba(0, 0, 0, 0.2);
                        border-top-color: rgba(33, 128, 192, 0.8);
                        border-radius: 100%;
                        animation: rotation 0.7s infinite linear;
                    }
                
                    .spinner.tiny {
                        height: 20px;
                        width: 20px;
                        border-top-color: #007bff;
                        position: relative;
                        top: 3px;
                    }
                
                    @keyframes rotation {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(359deg);
                        }
                    }
                
                    `,
                    hidden: true,
                },
            }}
            customSetup={{
                dependencies: {
                    "@paypal/react-paypal-js": "latest",
                },
                entry: "/index.js",
            }}
            options={{
                showLineNumbers: true,
                editorHeight: 600,
            }}
        />
        <ArgsTable story={CURRENT_SELECTION} />
    </>
);
