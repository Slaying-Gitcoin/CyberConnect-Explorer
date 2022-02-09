import type { NextApiRequest, NextApiResponse } from "next";
import { ERROR_MESSAGE } from "./ProvideAxios";

const axios = require("axios").default;
const qs = require("qs");

export default async function getAssets(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.query["owner"]) {
    const URL = `https://api.opensea.io/api/v1/assets`;
    const response = await axios.get(URL, {
      headers: {
        "X-API-KEY": process.env.OPEN_SEA_API_KEY,
      },
      params: {
        owner: req.query["owner"],
        ...(req.query["token_ids"]
          ? { token_ids: req.query["token_ids"] }
          : {}),
        ...(req.query["constract_address"]
          ? { asset_contract_address: req.query["constract_address"] }
          : {}),
        ...(req.query["limit"] ? { limit: req.query["limit"] } : {}),
        ...(req.query["offset"] ? { offset: req.query["offset"] } : {}),
        ...(req.query["collection"] ? { offset: req.query["collection"] } : {}),
      },
      paramsSerializer: (params: any) => {
        return qs.stringify(params);
      },
    });
    res.status(200).json({ data: response.data });
  } else {
    res.status(400).json({ error: ERROR_MESSAGE });
  }
}
