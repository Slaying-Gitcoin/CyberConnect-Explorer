const axios = require("axios").default;

function GetERC721Transfer() {
  const data = axios
    .get("/api/get_erc721_transfer_list_api", {
      params: {
        address: "0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
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

export function GetERC721TransferTest() {
  return (
    <div>
      <GetERC721Transfer />
    </div>
  );
}
