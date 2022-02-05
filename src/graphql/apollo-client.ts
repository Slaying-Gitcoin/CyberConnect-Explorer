import {
  ApolloClient,
  InMemoryCache
} from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

const cache = new InMemoryCache({
  // typePolicies: {
  //   Query: {
  //     fields: {
  //       identity: {
  //         keyArgs: ['address'],
  //         merge(existing, incoming) {
  //           if (!incoming) return existing

  //           const incomingList = incoming[Object.keys(incoming)[1]].list

  //           if (!existing) return incomingList // existing will be empty the first time

  //           const result = [...existing, ...incomingList]; // Merge existing items with the items from incoming

  //           return result
  //         }
  //       }
  //     },
  //   },
  // },
});

const client = new ApolloClient({
  uri: 'https://api.cybertino.io/connect/',
  cache: cache
});

export default client;