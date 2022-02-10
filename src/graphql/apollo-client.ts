import { ApolloClient, InMemoryCache } from '@apollo/client';
import { CYBERCONNECT_ENDPOINT } from '../defaults';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: CYBERCONNECT_ENDPOINT,
  cache: cache
});

export default client;