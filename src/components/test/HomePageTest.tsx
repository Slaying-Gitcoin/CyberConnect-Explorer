import { useQuery } from "@apollo/client";
import { HOME_PAGE } from "../../graphql/home_page_api"


function HomePage() {
  const { loading, error, data } = useQuery(HOME_PAGE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <p>
      {data.homePage.userCount}
    </p>
  );
}

export function HomePageTests() {
  return (
    <div>
      <HomePage />
    </div>
  );
}