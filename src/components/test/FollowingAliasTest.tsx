import { useQuery } from "@apollo/client";
import { FOLLOWING_ALIAS } from "../../graphql/following_alias_api"


function FollowingAlias() {
  const { loading, error, data } = useQuery(FOLLOWING_ALIAS, { variables: { 
    fromAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    toAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E'
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;


  return (
    <p>
      {data.followingAlias}
    </p>
  );
}

export function FollowingAliasTests() {
  return (
    <div>
      <FollowingAlias />
    </div>
  );
}