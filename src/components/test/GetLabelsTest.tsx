const axios = require("axios").default;

function GetLabels() {
  const req = [
    "0x7a16331a2fd97725829ad655f2392a3d9d5e186b",
    "0x2201e7d0911b1bb990d2dca5ee40a58a3e43dbc5",
    "0x31b0974c01bb70fe9b1cfc9770af0b568da7c90b",
  ];

  const data = axios
    .post("/api/get_labels_api", { req })
    .then(function (response: any) {
      console.log(response.data);
    })
    .catch(function (error: { response: any }) {
      // handle error
      console.log(error.response);
    });

  return <p>{"Look at console"}</p>;
}

export function GetLabelsTest() {
  return (
    <div>
      <GetLabels />
    </div>
  );
}
