const axios = require("axios").default;

function GetERC20Transfer() {
  const data = axios
    .get("/api/get_erc20_transfer_list_api", {
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

export function GetERC20TransferTest() {
  return (
    <div>
      <GetERC20Transfer />
    </div>
  );
}
