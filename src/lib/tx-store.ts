import { create } from 'zustand'

interface Proposal {
  contract: string;
  id: number;
}

interface TxStoreState {
  proposal: Proposal | null;
  setProposal: (contract: string, id: number) => void;
  clearProposal: () => void;
}

export const useTxStore = create<TxStoreState>((set) => ({
  proposal: null,
  setProposal: (contract, id) => set({ proposal: { contract, id } }),
  clearProposal: () => set({ proposal: null }),
}));
