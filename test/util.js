import { useScriptReducer } from '../src/ScriptContext';

export function setupTestComponent() {
    const state = {};
    function TestComponent() {
        const [ scriptState ] = useScriptReducer();
        Object.assign(state, scriptState);
        return null;
    }

    return {
        state,
        TestComponent
    };
}
