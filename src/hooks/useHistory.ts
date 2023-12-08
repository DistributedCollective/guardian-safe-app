import { Contract } from "ethers";
import { useEffect, useMemo } from "react";
import { multisigContracts } from "../config/multisig";
import { CHAIN_ID } from "../config/network";
import abi from "../abi/multisig.json";
import { getProvider } from "@sovryn/ethers-provider";

export const useHistory = () => {
  const provider = useMemo(() => getProvider(CHAIN_ID), []);
  const contract = useMemo(() => new Contract(multisigContracts[CHAIN_ID]!, abi, getProvider(CHAIN_ID)), []);
};

