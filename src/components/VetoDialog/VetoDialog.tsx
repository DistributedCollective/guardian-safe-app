import { AddressBadge, Button, ButtonStyle, Dialog, DialogBody, DialogHeader } from "@sovryn/ui";
import { useRefetchTrigger, useTxStore } from "../../lib/tx-store";
import { useCallback, useEffect, useState } from "react";
import { Contract, constants } from "ethers";
import { MULTISIG_CONTRACT_ADDRESS } from "../../config/constants";
import { getProvider } from "@sovryn/ethers-provider";
import { CHAIN_ID } from "../../config/network";
import abi from '../../abi/multisig.json';
import { useAccount } from "../../hooks/useAccount";
import { generateCancelData } from "../../lib/helpers";
import { LinkHashToExplorer } from "../LinkToExplorer/LinkToExplorer";

const contract = new Contract(MULTISIG_CONTRACT_ADDRESS, abi, getProvider(CHAIN_ID));

enum TxState {
  user,
  pending,
  success,
  error,
}

export const VetoDialog = () => {
  
  const selectedProposal = useTxStore(state => state.proposal);
  const closeDialog = useTxStore(state => state.clearProposal);
  const markCompleted = useRefetchTrigger(state => state.trigger);

  const [txHash, setTxHash] = useState<string | null>(null);
  const [txState, setTxState] = useState<TxState | null>(null);

  const { signer } = useAccount();

  useEffect(() => {
    const unsubscribe = useTxStore.subscribe(() => {
      setTxHash(null);
      setTxState(null);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = useCallback(async () => {
    const c = contract.connect(signer!);
    return await c.submitTransaction(selectedProposal!.emittedBy.id, constants.Zero, generateCancelData(selectedProposal!.proposalId));
  }, [selectedProposal, signer]);

  const handleConfirm = useCallback(async () => {
    const c = contract.connect(signer!);
    return await c.confirmTransaction(selectedProposal!.transactionId, { gasLimit: 1_000_000 });
  }, [selectedProposal, signer]);

  const handleExecute = useCallback(async () => {
    const c = contract.connect(signer!);
    return await c.executeTransaction(selectedProposal!.transactionId, { gasLimit: 1_000_000 });
  }, [selectedProposal, signer]);

  const handleVetoButton = useCallback(async () => {
    if (!selectedProposal) return;
    try {
      let tx;
      setTxHash(null);
      setTxState(TxState.user);
      if (selectedProposal.status === null) {
        tx = await handleSubmit();
      } else if (selectedProposal.status === 'SUBMITTED') {
        tx = await handleConfirm();
      } else if (selectedProposal.status === 'FAILED') {
        tx = await handleExecute();
      }
  
      setTxHash(tx.hash);
      setTxState(TxState.pending);
      await tx.wait();
      setTxState(TxState.success);
      markCompleted();
    } catch (e) {
      setTxState(TxState.error);
      console.error(e);
    }
  }, [handleConfirm, handleExecute, handleSubmit, markCompleted, selectedProposal]);

  return <Dialog isOpen={selectedProposal !== null} onClose={closeDialog}>
    <DialogHeader title="Veto Proposal" />
    <DialogBody>
      <div className="text-center">
        {txHash === null && (
          <>
            <p>Are you sure you want to veto this proposal?</p>
            <p className="text-red-500">This action cannot be undone.</p>
            <div className="flex flex-row justify-end gap-4 mt-4">
              <Button style={ButtonStyle.secondary} text="Cancel" onClick={closeDialog} />
              <Button text="Veto" onClick={handleVetoButton} loading={txState === TxState.user} disabled={txState === TxState.user} />
            </div>
          </>
        )}
        {txHash !== null && (
          <>
            {txState === TxState.pending && <p>Transaction pending.</p>}
            {txState === TxState.success && <p>Transaction successful.</p>}
            {txState === TxState.error && <p>Transaction failed.</p>}
            <div className="my-4"><LinkHashToExplorer value={txHash} label={<AddressBadge address={txHash} />} /></div>
            <Button style={ButtonStyle.secondary} text="Close Dialog" onClick={closeDialog} />
          </>
        )}
      </div>
    </DialogBody>
  </Dialog>;
};
