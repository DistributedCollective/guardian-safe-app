import { gql, useQuery } from "@apollo/client";
import { MULTISIG_CONTRACT_ADDRESS } from "../config/constants";

const QUERY_MULTISIG = gql`
  query getProposals ($timestamp: Int!) {
    multisigContract(id: "${MULTISIG_CONTRACT_ADDRESS}") {
      id
      required
      owners {
        id
      }
    }
  }
`;

export type MultisigType = {
  id: string;
  required: number;
  owners: { id: string }[];
};

export const useMultisigData = () => {
  const { data, loading } = useQuery(QUERY_MULTISIG);
  return { loading, data: (data?.multisigContract ?? { id: '', required: 0, owners: [] }) as MultisigType };
};
