import { gql, useQuery } from "@apollo/client";
import { MULTISIG_CONTRACT_ADDRESS } from "../config/constants";
import { useProposalMapper } from "./useProposalMapper";

const QUERY_PROPOSALS = gql`
  query getProposals ($timestamp: Int!) {
    multisigContract(id: "${MULTISIG_CONTRACT_ADDRESS}") {
      id
      required
      owners {
        id
      }
    }
    proposals (where: { eta_not: 0 eta_gt: $timestamp, executed: null, queued_not: null, canceled: null }) {
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

export const useActiveBitocracyProposals = () => {
  const proposals = useQuery(QUERY_PROPOSALS, { variables: { timestamp: Math.floor(Date.now() / 1000) }});
  return useProposalMapper(proposals);
};
