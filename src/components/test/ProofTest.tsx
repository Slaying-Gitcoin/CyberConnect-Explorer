import { useQuery } from "@apollo/client";
import { PROOF } from "../../graphql/proof_api"


function Proof() {
  const { loading, error, data } = useQuery(PROOF, { variables: { 
    fromAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    toAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E'
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.proof}
    </p>
  );
}

export function ProofTests() {
  return (
    <div>
      <Proof />
    </div>
  );
}