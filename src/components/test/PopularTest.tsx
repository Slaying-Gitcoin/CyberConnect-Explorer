import { useQuery } from "@apollo/client";
import { POPULAR , TagsInput, TAG } from "../../graphql/popular_api"


function PopularByPagination() {
 var tags = new TagsInput([TAG.PLAZA])
  const { loading, error, data } = useQuery(POPULAR, { variables: { 
    address: '0x8ddD03b89116ba89E28Ef703fe037fF77451e38E',
    numberOfPopular:5,
    nextCursor:"3",
    tags:tags // should be sth like tags:{list:[PLAZA]} but now we have tags:{list:["PLAZA"]}
   } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.popular.list.size()}
    </p>
  );
}

export function PopularTests() {
  return (
    <div>
      <PopularByPagination />
    </div>
  );
}