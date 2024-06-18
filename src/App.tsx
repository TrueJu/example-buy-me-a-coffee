import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NODE_URL, NETWORK, WALLET_CONNECT_PROJECT_ID, APP_TITLE, APP_DESCRIPTION, APP_ICONS } from '~/config';
import { Helmet } from "react-helmet";
import Layout from './Layout';
import BuyCoffee from './BuyCoffee';
import { Connex } from '@vechain/connex'

// define wallet connect options only in case a project id has been provided
const walletConnectOptions = !WALLET_CONNECT_PROJECT_ID ? undefined : {
    projectId: WALLET_CONNECT_PROJECT_ID,
    metadata: {
        name: APP_TITLE,
        description: APP_DESCRIPTION,
        url: window.location.origin,
        icons: APP_ICONS
    },
};

// query client for react-query
const queryClient = new QueryClient()

export default async function App() {

    const connexInstance = new Connex({
        node: 'https://testnet.vechain.org',
        network: 'test',
    });

    const exchangeABI ={
        "type": "function",
        "name": "exchange",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    };

    const clause = connexInstance.thor
        //Contract address
        .account('0x6c09952e7e8cd483ee3b57b4c468c9cfa59aff34')
        .method(exchangeABI)
        .value('100')
        .asClause();

    const result = await connexInstance.vendor
        .sign("tx", [clause])
        .request();
    
    console.log(result);


    return (
        <Providers>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{APP_TITLE}</title>
            </Helmet>

            <Layout>
                <BuyCoffee />
            </Layout>
        </Providers>
    )
}

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <DAppKitProvider
                // the network & node to connect to
                nodeUrl={NODE_URL}
                genesis={NETWORK}
                // remember last connected address on page reload
                usePersistence={true}
                // optionally enable walletConnect, which will be used for mobile wallets
                walletConnectOptions={walletConnectOptions}
            >
                {children}
            </DAppKitProvider>
        </QueryClientProvider>
    );
}