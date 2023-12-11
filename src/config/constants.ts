import { IS_MAINNET } from "./network";

export const SUBGRAPH_URL_MAINNET = 'https://subgraph.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';
export const SUBGRAPH_URL_TESTNET = 'http://graphql-test-sov-0-2-27-1215026962.us-east-2.elb.amazonaws.com/subgraphs/name/DistributedCollective/sovryn-subgraph';
// export const SUBGRAPH_URL_TESTNET = 'https://subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';

export const SUBGRAPH_URL = IS_MAINNET ? SUBGRAPH_URL_MAINNET : SUBGRAPH_URL_TESTNET;

export const BITOCRACY_CANCEL_SIGNATURE = '0x40e58ee5';
