import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { loadScript } from '@paypal/paypal-js';

import { ScriptProvider } from '../src/ScriptContext';

import { setupTestComponent } from './util';

describe('<ScriptProvider />', () => {
    const loadScriptBackup = loadScript;

    beforeEach(() => {
        document.head.innerHTML = '';

        // eslint-disable-next-line no-import-assign
        loadScript = jest.fn().mockImplementation((options) => {
            return new Promise((resolve) => {
                loadScriptBackup(options);
                process.nextTick(() => resolve());
            });
        });
    });

    test('should add the JS SDK <script> to the DOM', () => {
        render(<ScriptProvider options={ { 'client-id': 'sb' } } />);

        const script = document.querySelector('head script');
        expect(script).toBeTruthy();
        expect(script.src).toBe('https://www.paypal.com/sdk/js?client-id=sb');
    });

    test('should set "isLoaded" state to true after loading the script', async () => {
        const { state, TestComponent } = setupTestComponent();
        render(
            <ScriptProvider options={ { 'client-id': 'sb' } }>
                <TestComponent />
            </ScriptProvider>
        );

        // verify initial loading state
        expect(state.isLoaded).toBe(false);
        await waitFor(() => expect(state.isLoaded).toBe(true));
    });
});

describe('useScriptReducer', () => {
    test('should manage state for loadScript() options and for "isLoaded"', () => {
        const { state, TestComponent } = setupTestComponent();
        render(
            <ScriptProvider options={ { 'client-id': 'sb' } }>
                <TestComponent />
            </ScriptProvider>
        );

        expect(state).toHaveProperty('options');
        expect(state).toHaveProperty('isLoaded');
    });

    test('should throw an error when used without <ScriptProvider>', () => {
        const { TestComponent } = setupTestComponent();

        jest.spyOn(console, 'error');

        // eslint-disable-next-line no-console, no-empty-function
        console.error.mockImplementation(() => {});

        expect(() => render(<TestComponent />)).toThrow();
        // eslint-disable-next-line no-console
        console.error.mockRestore();
    });
});
