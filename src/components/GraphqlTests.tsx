import { useQuery } from "@apollo/client";
import { GET_IDENTITY } from "../graphql/qraph_api";

function GetIdentity() {
  const { loading, error, data } = useQuery(GET_IDENTITY, { variables: { address: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E' } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.identity.address}
    </p>
  );
}

export function GraphqlTests() {
  return (
    <div>
      <GetIdentity />
    </div>
  );
}