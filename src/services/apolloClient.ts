import { useAuthStore } from '@/store/auth';
import { AppConfig } from '@/utils/app.config';
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const API_URL = `${AppConfig().API_URL}/graphql`;

const httpLink = createHttpLink({
    uri: API_URL,
});
const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token; // Get JWT token from Zustand store
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink), // Combine authLink with httpLink
    cache: new InMemoryCache(),
});

// GraphQL Query to Fetch Invoice Reports
export const GET_DASHBOARD_REPORTS = gql`
  query GetDashboardReports {
    getInvoiceReport {
      totalInvoices
      paidInvoices
      unpaidInvoices
      declinedInvoices
    }
    getUserReport {
        totalUsers
        clients
        admins
    }
  }
`;

// GraphQL Query to Fetch Invoice Reports
export const GET_USER_REPORT = gql`
  query GetUserReport {
    getUserReport {
        totalUsers
        clients
        admins
    }
  }
`;
