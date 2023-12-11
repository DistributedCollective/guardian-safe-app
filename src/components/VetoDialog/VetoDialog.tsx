import { Dialog } from "@sovryn/ui";
import { useTxStore } from "../../lib/tx-store";

export const VetoDialog = () => {
  const selectedProposal = useTxStore(state => state.proposal);
  const closeDialog = useTxStore(state => state.clearProposal);

  return <Dialog isOpen={selectedProposal !== null} onClose={closeDialog}>
    <div className="text-center">
      <p>Are you sure you want to veto this proposal?</p>
      <p className="text-red-500">This action cannot be undone.</p>
    </div>
  </Dialog>;
};
