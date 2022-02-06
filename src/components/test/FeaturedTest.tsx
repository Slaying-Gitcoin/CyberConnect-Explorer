import { useQuery } from "@apollo/client";
import { FEATURED } from "../../graphql/featured_api"


function Featured() {
  const { loading, error, data } = useQuery(FEATURED, { variables: { 
    fromAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E'
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.featured[0].address}
    </p>
  );
}

export function FeaturedTests() {
  return (
    <div>
      <Featured />
    </div>
  );
}