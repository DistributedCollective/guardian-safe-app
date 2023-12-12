import { multisigContracts } from "./multisig";
import { CHAIN_ID, IS_MAINNET } from "./network";

export const SUBGRAPH_URL_MAINNET = 'https://subgraph.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';
export const SUBGRAPH_URL_TESTNET = 'https://subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/sovryn-subgraph';

export const SUBGRAPH_URL = IS_MAINNET ? SUBGRAPH_URL_MAINNET : SUBGRAPH_URL_TESTNET;

export const BITOCRACY_CANCEL_SIGNATURE = '0x40e58ee5';

export const MULTISIG_CONTRACT_ADDRESS = multisigContracts[CHAIN_ID]!.toLowerCase();
