import { IS_MAINNET } from "./network";

export const SUBGRAPH_URL_MAINNET = 'https://subgraph.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';
export const SUBGRAPH_URL_TESTNET = 'https://subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';

export const SUBGRAPH_URL = IS_MAINNET ? SUBGRAPH_URL_MAINNET : SUBGRAPH_URL_TESTNET;
