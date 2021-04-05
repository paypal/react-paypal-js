# react-paypal-js

> React components for the [PayPal JS SDK](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/)

<div class="badges">
    <a href="https://github.com/paypal/react-paypal-js/actions?query=workflow%3Avalidate"><img src="https://img.shields.io/github/workflow/status/paypal/react-paypal-js/validate?logo=github&style=flat-square" alt="build status"></a>
    <a href="https://codecov.io/github/paypal/react-paypal-js/"><img src="https://img.shields.io/codecov/c/github/paypal/react-paypal-js.svg?style=flat-square" alt="coverage"></a>
    <a href="https://www.npmjs.com/package/@paypal/react-paypal-js"><img src="https://img.shields.io/npm/v/@paypal/react-paypal-js.svg?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmtrends.com/@paypal/react-paypal-js"><img src="https://img.shields.io/npm/dm/@paypal/react-paypal-js.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/paypal/react-paypal-js/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@paypal/react-paypal-js.svg?style=flat-square" alt="apache license"></a>
    <a href="https://paypal.github.io/react-paypal-js/"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg" alt="storybook"></a>
</div>

## Why use react-paypal-js?

### The Problem

Developers integrating with PayPal are expected to add the JS SDK `<script>` to a website and then render components like the PayPal Buttons after the script loads. This architecture works great for simple websites but can be challenging when building single page apps.

React developers think in terms of components and not about loading external scripts from an index.html file. It's easy to end up with a React PayPal integration that's sub-optimal and hurts the buyer's user experience. For example, abstracting away all the implementation details of the PayPal Buttons into a single React component is an anti-pattern because it tightly couples script loading with rendering. It's also problematic when you need to render multiple different PayPal components that share the same global script parameters.

### The Solution

`react-paypal-js` provides a solution to developers to abstract away complexities around loading the JS SDK. It enforces best practices by default so buyers get the best possible user experience.

**Features**

-   Enforce async loading the JS SDK up front so when it's time to render the buttons to your buyer, they render immediately.
-   Abstract away the complexity around loading the JS SDK with the global [PayPalScriptProvider](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalscriptprovider--default) component.
-   Support dispatching actions to reload the JS SDK and re-render components when global parameters like `currency` change.
-   Easy to use components for all the different PayPal product offerings:
    -   [PayPalButtons](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalbuttons--default)
    -   [PayPalMarks](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalmarks--default)
    -   [PayPalMessages](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalmessages--default)

## Installation

To get started, install react-paypal-js with npm.

```sh
npm install @paypal/react-paypal-js
```

## Usage

This PayPal React library consists of two main parts:

1. Context Provider - this `<PayPalScriptProvider />` component manages loading the JS SDK script. Add it to the root of your React app. It uses the [Context API](https://reactjs.org/docs/context.html) for managing state and communicating to child components. It also supports reloading the script when parameters change.
2. SDK Components - components like `<PayPalButtons />` are used to render the UI for PayPal products served by the JS SDK.

```jsx
// App.js
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function App() {
    return (
        <PayPalScriptProvider options={{ "client-id": "test" }}>
            <PayPalButtons style={{ layout: "horizontal" }} />
        </PayPalScriptProvider>
    );
}
```

### PayPalScriptProvider

#### Options

Use the PayPalScriptProvider `options` prop to configure the JS SDK. It accepts an object for passing query parameters and data attributes to the JS SDK script.

```jsx
const initialOptions = {
    "client-id": "test",
    currency: "USD",
    intent: "capture",
    "data-client-token": "abc123xyz==",
};

export default function App() {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons />
        </PayPalScriptProvider>
    );
}
```

The [JS SDK Configuration guide](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-configuration/) contains the full list of query parameters and data attributes that can be used with the JS SDK.

#### deferLoading

Use the optional PayPalScriptProvider `deferLoading` prop to control when the JS SDK script loads.

-   This prop is set to false by default since we usually know all the sdk script params up front and want to load the script right way so components like `<PayPalButtons />` render immediately.
-   This prop can be set to true to prevent loading the JS SDK script when the PayPalScriptProvider renders. Use `deferLoading={true}` initially and then dispatch an action later on in the app's life cycle to load the sdk script.

```jsx
<PayPalScriptProvider deferLoading={true} options={initialOptions}>
    <PayPalButtons />
</PayPalScriptProvider>
```

To learn more, check out the [defer loading example in storybook](https://paypal.github.io/react-paypal-js/?path=/story/example-paypalscriptprovider--defer-loading).

#### Tracking loading state

The `<PayPalScriptProvider />` component is designed to be used with the `usePayPalScriptReducer` hook for managing global state. This `usePayPalScriptReducer` hook has the same API as [React's useReducer hook](https://reactjs.org/docs/hooks-reference.html#usereducer).

The `usePayPalScriptReducer` hook provides an easy way to tap into the loading state of the JS SDK script. This state can be used to show a loading spinner while the script loads or an error message if it fails to load. The following derived attributes are provided for tracking this loading state:

-   isInitial - not started (only used when passing `deferLoading={true}`)
-   isPending - loading (default)
-   isResolved - successfully loaded
-   isRejected - failed to load

For example, here's how you can use it to show a loading spinner.

```jsx
const [{ isPending }] = usePayPalScriptReducer();

return (
    <>
        {isPending ? <div className="spinner" /> : null}
        <PayPalButtons />
    </>
);
```

To learn more, check out the [loading spinner example in storybook](https://paypal.github.io/react-paypal-js/?path=/story/example-usepaypalscriptreducer--loading-spinner).

#### Reloading when parameters change

The `usePayPalScriptReducer` hook can be used to reload the JS SDK script when parameters like currency change. It provides the action `resetOptions` for reloading with new parameters. For example, here's how you can use it to change currency.

```jsx
// get the state for the sdk script and the dispatch method
const [{ options }, dispatch] = usePayPalScriptReducer();
const [currency, setCurrency] = useState(options.currency);

function onCurrencyChange({ target: { value } }) {
    setCurrency(value);
    dispatch({
        type: "resetOptions",
        value: {
            ...options,
            currency: value,
        },
    });
}

return (
    <>
        <select value={currency} onChange={onCurrencyChange}>
            <option value="USD">United States dollar</option>
            <option value="EUR">Euro</option>
        </select>
        <PayPalButtons />
    </>
);
```

To learn more, check out the [dynamic currency example in storybook](https://paypal.github.io/react-paypal-js/?path=/story/example-usepaypalscriptreducer--currency).

### PayPalButtons

The `<PayPalButtons />` component is fully documented in Storybook. Checkout the [docs page for the PayPalButtons](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalbuttons--default) to learn more about the available props.

### Browser Support

This library supports all popular browsers, including IE 11. It provides the same browser support as the JS SDK. Here's the [full list of supported browsers](https://developer.paypal.com/docs/business/checkout/reference/browser-support/#supported-browsers-by-platform).
