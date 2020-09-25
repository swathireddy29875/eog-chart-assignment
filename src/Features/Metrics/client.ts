import { createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const subscriptionClient = new SubscriptionClient(
    `ws://react.eogresources.com/graphql`,
    {
        reconnect: true,
    }
)

export default createClient({
    url: `https://react.eogresources.com/graphql`,
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (operation) => subscriptionClient.request(operation)
        })
    ]
})