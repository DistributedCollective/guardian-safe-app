import { AddressBadge, ColumnOptions, Link, Table, Tooltip } from "@sovryn/ui";
import { ProposalType, useActiveBitocracyProposals } from "../../hooks/useActiveProposals";
import { useMemo } from "react";
import { truncate } from "../../lib/helpers";
import { VetoAction } from "../VetoAction/VetoAction";

type RowType = {
  id: string;
  title: string;
  signatures: string;
  deadline: string;
  proposalId: string;
  item: ProposalType;
};

const COLUMNS: ColumnOptions<RowType>[] = [{
  id: 'id',
  title: 'Proposal ID',
  }, {
  id: 'title',
  title: 'Title',
  cellRenderer: (row) => <Link href={`https://sovryn.app/bitocracy/${row.proposalId}`} text={truncate(row.title, 20)} openNewTab />,
  }, {
  id: 'signatures',
  title: 'Signatures',
  cellRenderer: row => <Tooltip content={<div>{row.item.confirmations.length > 0 ? row.item.confirmations.map(item => <AddressBadge key={item.signer.id} address={item.signer.id} />) : <span>Not vetoing.</span>}</div>}><span>{row.signatures}</span></Tooltip>,
  }, {
  id: 'deadline',
  title: 'Time to veto',
}, {
  id: 'actions',
  title: <></>,
  cellRenderer: row => <VetoAction proposal={row.item} />
}];

export const ReviewProposals = () => {
  const { loading, data } = useActiveBitocracyProposals();

  const items = useMemo(() => data.map((item: ProposalType) => {
    return {
      id: `${item.emittedBy.type}-${item.proposalId}`,
      title: item.description,
      deadline: new Date(item.eta * 1000).toISOString(),
      proposalId: item.id,
      signatures: `${item.confirmations.length}/${item.required}`,
      item,
    };
  }), [data]);

  return <Table isLoading={loading} columns={COLUMNS} rows={items} rowTitle={item => item.title} />;
};
