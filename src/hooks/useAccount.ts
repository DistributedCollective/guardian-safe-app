import { useCallback, useEffect, useState } from "react";
import { startWith } from "rxjs";
import { ethers } from "ethers";
import { onboard } from "../config/network";
import { state } from "../state/shared";

export const useAccount = () => {
  const [value, setValue] = useState(state.get());

  const connect = useCallback(() => onboard.connectWallet(), []);
  
  useEffect(() => {
    const sub = onboard.state.select('wallets').pipe(startWith(onboard.state.get().wallets)).subscribe((wallets) => {
      if (wallets.length) {
        const provider = new ethers.providers.Web3Provider(onboard.state.get().wallets[0]?.provider);
        state.actions.connectWallet(wallets[0].accounts[0].address, provider.getSigner());
      } else {
        state.actions.disconnectWallet();
      }
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const sub = state.select().subscribe(setValue);
    return () => sub.unsubscribe();
  }, []);

  return {
    ...value,
    connect,
  }
};
