import type { Story } from "@storybook/react";
import { generateDocPageStructure } from "../commons";

import { Default, RadioButtons } from "./PayPalMarks.stories";

const overrideStories = (): void => {
    // Override the Default story doc page
    (Default as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure(Default.name),
            transformSource: (_: string, snippet: Story) => `
<PayPalScriptProvider options={{
    'client-id': 'test',
    components: 'buttons,marks,funding-eligibility',
    'data-namespace': 'set_unique_identifier_here',
    'data-uid': 'set_unique_identifier_here'
}}>
    <PayPalMarks${
        snippet?.args?.fundingSource
            ? ` fundingSource="${snippet?.args?.fundingSource}"`
            : ""
    } />
</PayPalScriptProvider>`,
        },
    };

    // Override the Default story controls table props
    (Default as Story).argTypes = {
        amount: { table: { disable: true } },
        style: { table: { disable: true } },
    };

    // Override the Default story doc page
    (RadioButtons as Story).parameters = {
        docs: {
            page: () => generateDocPageStructure("Radio Buttons"),
            transformSource: (_: string, snippet: Story) => `
({ amount }) => {
    const fundingSources = [FUNDING.PAYPAL, FUNDING.CARD, FUNDING.PAYLATER];
    // Remember the amount props is received from the control panel
    const [selectedFundingSource, setSelectedFundingSource] = useState(
        fundingSources[0]
    );

    function onChange(event) {
        setSelectedFundingSource(event.target.value);
    }

    return (<PayPalScriptProvider options={{
        'client-id': 'test',
        components: 'buttons,marks,funding-eligibility',
        'data-namespace': 'set_unique_identifier_here',
        'data-uid': 'set_unique_identifier_here'
    }}>
        <form style={{ minHeight: "200px" }}>
            {fundingSources.map((fundingSource) => (
                <label key={fundingSource}>
                    <input
                        defaultChecked={
                            fundingSource === selectedFundingSource
                        }
                        onChange={onChange}
                        type="radio"
                        name="fundingSource"
                        value={fundingSource}
                    />
                    <PayPalMarks fundingSource={fundingSource} />
                </label>
            ))}
        </form>
        <br />
        <PayPalButtons
            fundingSource={selectedFundingSource}
            forceReRender={[selectedFundingSource, amount]}
            style={${JSON.stringify(snippet?.args?.style)}}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        purchase_units: [
                            {
                                amount: {
                                    value: ${snippet?.args?.amount},
                                },
                            },
                        ],
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                    // Your code here after approve the transaction
                });
            }}
        />
    </PayPalScriptProvider>);
}
`,
        },
    };

    // Override the RadioButtons story controls table props
    (RadioButtons as Story).argTypes = {
        fundingSource: { table: { disable: true } },
    };
};

export default overrideStories;
