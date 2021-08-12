import { useContext } from "react";

import { ScriptContext } from "../context/scriptProviderContext";
import type { ScriptContextState } from "../types/scriptProviderTypes";
import {
    contextNotEmptyValidator,
    contextOptionClientTokenNotEmptyValidator,
} from "./contextValidator";

/**
 * Custom hook to get access to the ScriptProvider context
 *
 * @returns the state of the con text
 */
export function useBraintreeProviderContext(): ScriptContextState {
    return contextOptionClientTokenNotEmptyValidator(
        contextNotEmptyValidator(useContext(ScriptContext))
    );
}
