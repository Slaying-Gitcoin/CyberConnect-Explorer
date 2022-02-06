import { useQuery } from "@apollo/client";
import { FOLLOW_STATUS } from "../../graphql/follow_status_api"


function FollowStatus() {
  const { loading, error, data } = useQuery(FOLLOW_STATUS, { variables: { 
    fromAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    toAddress: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E'
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.followStatus.isFollowed.toString()}
    </p>
  );
}

export function FollowStatusTests() {
  return (
    <div>
      <FollowStatus />
    </div>
  );
}