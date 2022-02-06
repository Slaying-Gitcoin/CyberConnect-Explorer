import { useQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS , RecommFilter } from "../../graphql/get_recommendations_api"


function GetRecommendationsByPagination() {
  const { loading, error, data } = useQuery(GET_RECOMMENDATIONS, { variables: { 
    address: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    numberOfRecomms:5,
    nextCursor:"3",
    filter:RecommFilter[RecommFilter.GAME]
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.recommendations.result}
    </p>
  );
}

export function GetRecommandationsTests() {
  return (
    <div>
      <GetRecommendationsByPagination />
    </div>
  );
}