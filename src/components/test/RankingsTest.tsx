import { useQuery } from "@apollo/client";
import { RANKINGS } from "../../graphql/rankings_api"


function RankingsByPagination() {
  const { loading, error, data } = useQuery(RANKINGS, { variables: { 
    fromAddr: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    numberOfRankings:5,
    nextCursor:"3"
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.rankings.data.list[0].address}
    </p>
  );
}

export function RankingsTests() {
  return (
    <div>
      <RankingsByPagination />
    </div>
  );
}