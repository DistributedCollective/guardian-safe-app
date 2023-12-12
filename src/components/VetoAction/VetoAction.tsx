import { FC, useCallback, useMemo } from "react";
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

  const handleVetoButton = useCallback(() => setProposal(proposal), [proposal, setProposal]);

  const disabled = useMemo(() => {
    if (
      !proposal.confirmations.some((item) => item.signer.id.toLowerCase() === address?.toLowerCase())
    ) {
      return false;
    }
    return loading;
  }, [address, loading, proposal.confirmations]);

  return <Button text="Veto" disabled={disabled} onClick={handleVetoButton} />;
};
