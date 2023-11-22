import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SUBGRAPH_URL } from '../config/constants';

export const apollo = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

