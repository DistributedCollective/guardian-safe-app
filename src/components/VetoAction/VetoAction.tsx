import { FC, useCallback } from "react";
import { Button } from "@sovryn/ui";
import { ProposalType } from "../../hooks/useActiveProposals";
import { useAccount } from "../../hooks/useAccount";
import { useTxStore } from "../../lib/tx-store";

type VetoActionProps = {
  proposal: ProposalType;
};

export const VetoAction: FC<VetoActionProps> = ({ proposal }) => {
  const { address } = useAccount();
  const loading = useTxStore(state => state.proposal !== null);
  const setProposal = useTxStore(state => state.setProposal);

  const handleVetoButton = useCallback(() => setProposal(proposal.emittedBy.id, proposal.proposalId), [proposal.emittedBy.id, proposal.proposalId, setProposal]);

  if (proposal.status === null || !proposal.confirmations.find((item) => item.signer.toLowerCase() === address?.toLowerCase())) {
    return <Button text="Veto" disabled={loading} onClick={handleVetoButton} />;
  }
  return null;
};
