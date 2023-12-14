import { ChainIds } from "@sovryn/ethers-provider";
import { FC } from "react";
import { CHAIN_ID } from "../../config/network";
import { truncate } from "../../lib/helpers";

const URLS: Record<string, string> = {
  [ChainIds.RSK_MAINNET]: 'https://sovryn.app/bitocracy',
  [ChainIds.RSK_TESTNET]: 'https://test.sovryn.app/bitocracy',
};

const URL = URLS[CHAIN_ID];

type Props = { id: string; title: string; };

export const LinkToBitocracy: FC<Props> = ({ id, title }) => <a href={`${URL}/${id}`} target="_blank" rel="noreferrer">{truncate(title, 20)}</a>;
