import { useMemo } from "react";
import { Button, ButtonStyle, ColumnOptions, Link, Table } from "@sovryn/ui";
import { ProposalType } from "../../hooks/useActiveProposals";
import { truncate } from "../../lib/helpers";
import { useCanceledProposals } from "../../hooks/useCanceledProposals";

type RowType = {
  id: string;
  title: string;
  signatures: string;
  proposalId: string;
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
  cellRenderer: row => <>{row.signatures}</>,
  }, {
  id: 'actions',
  title: <></>,
  cellRenderer: () => <Button disabled text="Vetoed" style={ButtonStyle.secondary} />,
}];

export const VetoedProposals = () => {
  const { loading, data } = useCanceledProposals();

  const items = useMemo(() => data.map((item: ProposalType) => {
    return {
      id: `${item.emittedBy.type}-${item.proposalId}`,
      title: item.description,
      proposalId: item.id,
      signatures: `${item.confirmations.length}/${item.required}`
    };
  }), [data]);

  return <Table isLoading={loading} columns={COLUMNS} rows={items} rowTitle={item => item.title} />;
};
