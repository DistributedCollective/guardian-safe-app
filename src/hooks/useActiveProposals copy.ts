import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect } from "react";

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
    multisigTransactions (where: { destination_in: $destinations }) {
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

  console.log(proposals, vetoes);

  return proposals;
};
