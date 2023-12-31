import { useMemo } from "react";
import { Button, ButtonStyle, ColumnOptions, Table } from "@sovryn/ui";
import { ProposalType } from "../../hooks/useActiveProposals";
import { useCanceledProposals } from "../../hooks/useCanceledProposals";
import { ListOfSigners } from "../ListOfSigners/ListOfSigners";
import { LinkToBitocracy } from "../LinkToBitocracy/LinkToExplorer";

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
  cellRenderer: (row) => <LinkToBitocracy id={row.proposalId} title={row.title} />,
  }, {
  id: 'signatures',
  title: 'Signatures',
  cellRenderer: row => <ListOfSigners row={row} />,
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
      signatures: `${item.confirmations.length}/${item.required}`,
      item,
    };
  }), [data]);

  return <Table isLoading={loading} columns={COLUMNS} rows={items} rowTitle={item => item.title} />;
};
