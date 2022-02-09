const axios = require("axios").default;

function GetAssetEvents() {
  //You can add these lines as params too
  //collection_slug
  //token_id
  //account_address
  //only_opensea: false/true

  const data = axios
    .get("/api/get_asset_events", {
      params: {
        limit: 50,
        offset: 1,
        only_opensea: false,
      },
    })
    .then(function (response: any) {
      console.log(response.data);
    })
    .catch(function (error: { response: any }) {
      // handle error
      console.log(error.response);
    });

  return <p>{"Look at console"}</p>;
}

export function GetAssetEventsTest() {
  return (
    <div>
      <GetAssetEvents />
    </div>
  );
}
