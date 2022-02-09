import type { NextApiRequest, NextApiResponse } from "next";
import { ERROR_MESSAGE } from "./ProvideAxios";

const axios = require("axios").default;
const qs = require("qs");

export default async function getAssets(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const URL = `https://api.opensea.io/api/v1/events`;
  try {
    const response = await axios.get(URL, {
      headers: {
        "X-API-KEY": process.env.OPEN_SEA_API_KEY,
        Accept: "application/json",
      },
      params: {
        ...(req.query["asset_contract_address"]
          ? { asset_contract_address: req.query["asset_contract_address"] }
          : {}),
        ...(req.query["collection_slug"]
          ? { collection_slug: req.query["collection_slug"] }
          : {}),
        ...(req.query["token_id"] ? { token_id: req.query["token_id"] } : {}),
        ...(req.query["account_address"]
          ? { account_address: req.query["account_address"] }
          : {}),
        ...(req.query["offset"] ? { offset: req.query["offset"] } : {}),
        ...(req.query["limit"] ? { limit: req.query["limit"] } : {}),
        ...(req.query["only_opensea"]
          ? { only_opensea: req.query["only_opensea"] }
          : {}),
      },
    });
    res.status(200).json({ data: response.data });
  } catch (error) {
    //console.log(error);
  }
}
