import { gql, useQuery } from "@apollo/client";
import { MULTISIG_CONTRACT_ADDRESS } from "../config/constants";
import { useProposalMapper } from "./useProposalMapper";

const QUERY_PROPOSALS = gql`
  query getProposals {
    multisigContract(id: "${MULTISIG_CONTRACT_ADDRESS}") {
      id
      required
      owners {
        id
      }
    }
    proposals (where: { executed_not: null }) {
      id
      emittedBy {
        id
        type
      }
      proposalId
      description
      canceled {
        id
      }
    }
  }
`;

export const useCanceledProposals = () => {
  const proposals = useQuery(QUERY_PROPOSALS);
  return useProposalMapper(proposals);
};
