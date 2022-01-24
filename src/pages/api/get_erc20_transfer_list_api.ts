import type { NextApiRequest, NextApiResponse } from 'next'
import axios from './ProvideAxios';



export default async function getERC20TransferList(
    req: NextApiRequest,
    res: NextApiResponse<any>
    
  ) {
        const URL = `/api?module=account&action=tokentx&address=${req.query['address']}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
        const response = await axios.get(URL);
        res.status(200).json({ data: response.data })
  }