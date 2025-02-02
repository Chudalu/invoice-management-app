import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { apolloClient } from '@/services/apolloClient';
import { ApolloProvider } from '@apollo/client';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}
