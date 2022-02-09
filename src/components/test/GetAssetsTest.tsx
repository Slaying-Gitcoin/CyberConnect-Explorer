const axios = require("axios").default;

function GetAssets() {
  //You can add these two line as params too
  //token_ids: ["" , ""],
  //constract_address: "",

  const data = axios
    .get("/api/get_assets", {
      params: {
        owner: "0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
        limit: 50,
        offset: 0,
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

export function GetAssetsTest() {
  return (
    <div>
      <GetAssets />
    </div>
  );
}
