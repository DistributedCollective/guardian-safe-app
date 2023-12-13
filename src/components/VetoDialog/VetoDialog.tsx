import { AddressBadge, Button, ButtonStyle, Dialog, DialogBody, DialogHeader } from "@sovryn/ui";
import { useRefetchTrigger, useTxStore } from "../../lib/tx-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { Contract, constants } from "ethers";
import { MULTISIG_CONTRACT_ADDRESS } from "../../config/constants";
import { getProvider } from "@sovryn/ethers-provider";
import { CHAIN_ID } from "../../config/network";
import abi from '../../abi/multisig.json';
import { useAccount } from "../../hooks/useAccount";
import { generateCancelData } from "../../lib/helpers";
import { LinkHashToExplorer } from "../LinkToExplorer/LinkToExplorer";

export const VetoDialog = () => {
  const msContract = useRef(new Contract(MULTISIG_CONTRACT_ADDRESS, abi, getProvider(CHAIN_ID)));
  const selectedProposal = useTxStore(state => state.proposal);
  const closeDialog = useTxStore(state => state.clearProposal);
  const markCompleted = useRefetchTrigger(state => state.trigger);

  const [txHash, setTxHash] = useState<string | null>(null);
  const [txState, setTxState] = useState<'user' | 'pending' | 'success' | 'error' | null>(null);

  const { signer } = useAccount();

  useEffect(() => {
    const unsub = useTxStore.subscribe(() => {
      setTxHash(null);
      setTxState(null);
    });
    return () => unsub();
  }, []);

  const handleSubmit = useCallback(async () => {
    const c = msContract.current.connect(signer!);
    return await c.submitTransaction(selectedProposal!.emittedBy.id, constants.Zero, generateCancelData(selectedProposal!.proposalId));
  }, [selectedProposal, signer]);

  const handleConfirm = useCallback(async () => {
    const c = msContract.current.connect(signer!);
    return await c.confirmTransaction(selectedProposal!.transactionId, { gasLimit: 1_000_000 });
  }, [selectedProposal, signer]);

  const handleExecute = useCallback(async () => {
    const c = msContract.current.connect(signer!);
    return await c.executeTransaction(selectedProposal!.transactionId, { gasLimit: 1_000_000 });
  }, [selectedProposal, signer]);

  const handleVetoButton = useCallback(async () => {
    if (!selectedProposal) return;
    try {
      let tx;
      setTxHash(null);
      setTxState('user');
      if (selectedProposal.status === null) {
        tx = await handleSubmit();
      } else if (selectedProposal.status === 'SUBMITTED') {
        tx = await handleConfirm();
      } else if (selectedProposal.status === 'FAILED') {
        tx = await handleExecute();
      }
  
      setTxHash(tx.hash);
      setTxState('pending');
      await tx.wait();
      setTxState('success');
      markCompleted();
    } catch (e) {
      setTxState('error');
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
              <Button text="Veto" onClick={handleVetoButton} loading={txState === 'user'} disabled={txState === 'user'} />
            </div>
          </>
        )}
        {txHash !== null && (
          <>
            {txState === 'pending' && <p>Transaction pending.</p>}
            {txState === 'success' && <p>Transaction successfull.</p>}
            {txState === 'error' && <p>Transaction failed.</p>}
            <div className="my-4"><LinkHashToExplorer value={txHash} label={<AddressBadge address={txHash} />} /></div>
            <Button style={ButtonStyle.secondary} text="Close Dialog" onClick={closeDialog} />
          </>
        )}
      </div>
    </DialogBody>
  </Dialog>;
};
