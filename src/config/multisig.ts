import { ChainIds } from '@sovryn/ethers-provider';

export const multisigContracts: Partial<Record<ChainIds, string>> = {
  [ChainIds.RSK_MAINNET]: '0xdd8e07a57560ada0a2d84a96c457a5e6ddd488b7',
  [ChainIds.RSK_TESTNET]: '0x189ecD23E9e34CFC07bFC3b7f5711A23F43F8a57', // testnet guardian safe
};
