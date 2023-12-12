import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { BITOCRACY_CANCEL_SIGNATURE, MULTISIG_CONTRACT_ADDRESS } from "../config/constants";
import { generateCancelData } from "../lib/helpers";
import { useRefetchTrigger } from "../lib/tx-store";

const QUERY_PROPOSALS = gql`
  query getProposals ($timestamp: Int!) {
    multisigContract(id: "${MULTISIG_CONTRACT_ADDRESS}") {
      id
      required
      owners {
        id
      }
    }
    proposals (where: { canceled_not: null }) {
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
        id
        signer {
          id
        }
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
  confirmations: { signer: { id: string }; }[];
  required: number | null;
};

export const useCanceledProposals = () => {
  const proposals = useQuery(QUERY_PROPOSALS, { variables: { timestamp: Math.floor(Date.now() / 1000) }});
  const [getVetoes, vetoes] = useLazyQuery(QUERY_VETOES);

  const destinations = useMemo(() => {
    if (proposals?.data?.proposals) {
      const destinations = proposals.data.proposals.map((proposal: any) => proposal.emittedBy.id);
      if (destinations.length > 0) {
        return destinations;
      }
    }
    return [];
  }, [proposals.data]);

  useEffect(() => {
    if (destinations.length > 0) {
      getVetoes({ variables: { destinations }});
    }
  }, [destinations, getVetoes]);

  useEffect(() => {
    const unsub = useRefetchTrigger.subscribe((v) => {
      getVetoes({ variables: { destinations }});
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data: ProposalType[] = useMemo(() => {
    const { required } = proposals.data?.multisigContract || { required: 0 };

    if (proposals.data?.proposals && vetoes.data?.multisigTransactions) {
      return proposals.data.proposals.map((proposal: any) => mapProposal(proposal, required, vetoes.data?.multisigTransactions || []));
    }
    return proposals.data?.proposals?.map((proposal: any) => mapProposal(proposal, required, [])) || [];
  }, [proposals.data, vetoes.data]);

  return { ...proposals, data };
};


const mapProposal = (proposal: any, required: number, transactions: any[]) => {
  if (transactions.length > 0) {
    return { ...proposal, required, ...makeTx(proposal.emittedBy.id, proposal.proposalId, transactions) };
  }
  return {...proposal, transactionId: null, status: null, confirmations: [], required };
};

const makeTx = (bitocracy: string, proposalId: string, transactions: any[]) => {
  // todo: decode data and find tx with proposalId and "cancel" function
  const data = generateCancelData(Number(proposalId));
  const tx = transactions.find((tx: any) => tx.destination === bitocracy && tx.data === data);
  if (!tx) {
    return { transactionId: null, status: null, confirmations: [], };
  }
  return {
    transactionId: tx.transactionId,
    status: tx.status,
    confirmations: tx.confirmations,
  };
}