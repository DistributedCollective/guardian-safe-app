import { create } from 'zustand'
import { ProposalType } from '../hooks/useActiveProposals';

interface TxStoreState {
  proposal: ProposalType | null;
  setProposal: (proposal: ProposalType) => void;
  clearProposal: () => void;
}

export const useTxStore = create<TxStoreState>((set) => ({
  proposal: null,
  setProposal: (proposal) => set({ proposal }),
  clearProposal: () => set({ proposal: null }),
}));

interface RefetchTriggerState {
  refetch: number;
  trigger: () => void;
}

export const useRefetchTrigger = create<RefetchTriggerState>((set) => ({
  refetch: 0,
  trigger: () => set((state) => ({ refetch: state.refetch + 1 })),
}));
