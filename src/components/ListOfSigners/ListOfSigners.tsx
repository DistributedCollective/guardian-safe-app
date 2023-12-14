import { AddressBadge, Tooltip } from "@sovryn/ui";
import { FC } from "react";
import { LinkAccountToExplorer } from "../LinkToExplorer/LinkToExplorer";

type ListOfSignersProps = {
  row: any;
};

export const ListOfSigners: FC<ListOfSignersProps> = ({ row }) => <Tooltip content={<div>{row.item.confirmations.length > 0 ? row.item.confirmations.map((item: any) => <div key={item.signer.id}><LinkAccountToExplorer value={item.signer.id} label={<AddressBadge  address={item.signer.id} />} /></div>) : <span>Not signers yet</span>}</div>}><span>{row.signatures}</span></Tooltip>;
