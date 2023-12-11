import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { BITOCRACY_CANCEL_SIGNATURE } from "../config/constants";

const QUERY_PROPOSALS = gql`
  query getProposals ($timestamp: Int!) {
    proposals (where: { eta_not: 0 eta_lt: $timestamp, executed: null, queued_not: null, canceled: null }) {
      id
      emittedBy {
        id
        type
      }
      proposalId
      description
      eta
    
      executed {
        id
      }
      canceled {
        id
      }
    }
  }
`;

const QUERY_VETOES = gql`
  query getVetoes ($destinations: [Bytes]!) {
    multisigTransactions (where: { destination_in: $destinations, data_contains: "${BITOCRACY_CANCEL_SIGNATURE}" }) {
      id
      destination
      data
      transactionId
      status
      confirmations {
        signer
      }
      multisigContract {
        id
        required
      }
    }
  }
`;

export type ProposalType = {
  id: string;
  emittedBy: {
    id: string;
    type: string;
  };
  proposalId: number;
  description: string;
  eta: number;
  executed: {
    id: string;
  },
  canceled: {
    id: string;
  },
  transactionId: string | null;
  status: string | null;
  confirmations: { signer: string; }[];
  required: number | null;
};

export const useActiveBitocracyProposals = () => {
  const proposals = useQuery(QUERY_PROPOSALS, { variables: { timestamp: Math.floor(Date.now() / 1000) }});
  const [getVetoes, vetoes] = useLazyQuery(QUERY_VETOES);

  useEffect(() => {
    if (proposals.data?.proposals) {
      const destinations = proposals.data.proposals.map((proposal: any) => proposal.emittedBy.id);
      if (destinations.length > 0) {
        getVetoes({ variables: { destinations }});
      }
    }
  }, [getVetoes, proposals.data]);

  const data: ProposalType[] = useMemo(() => {
    if (proposals.data?.proposals && vetoes.data?.multisigTransactions) {
      return proposals.data.proposals.map((proposal: any) => mapProposal(proposal, vetoes.data?.multisigTransactions || []));
    }
    return proposals.data?.proposals?.map(mapProposal) || [];
  }, [proposals.data, vetoes.data]);

  return { ...proposals, data };
};


const mapProposal = (proposal: any, transactions: any[]) => {
  if (transactions.length > 0) {
    return { ...proposal, ...makeTx(proposal.emittedBy.id, proposal.proposalId, transactions) };
  }
  return {...proposal, transactionId: null, status: null, confirmations: [], required: 0 };
};

const makeTx = (bitocracy: string, proposalId: string, transactions: any[]) => {
  // todo: decode data and find tx with proposalId and "cancel" function
  const tx = transactions.find((tx: any) => tx.destination === bitocracy);
  if (!tx) {
    return { transactionId: null, status: null, confirmations: [], required: 0 };
  }
  return {
    transactionId: tx.transactionId,
    status: tx.status,
    confirmations: tx.confirmations,
    required: tx.multisigContract.required,
  };
}