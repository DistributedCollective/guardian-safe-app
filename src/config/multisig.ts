import { ChainIds } from '@sovryn/ethers-provider';

export const multisigContracts: Partial<Record<ChainIds, string>> = {
  [ChainIds.RSK_MAINNET]: '0x924f5ad34698fd20c90fe5d5a8a0abd3b42dc711',
  [ChainIds.RSK_TESTNET]: '0x189ecD23E9e34CFC07bFC3b7f5711A23F43F8a57',
};
