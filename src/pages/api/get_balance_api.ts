import type { NextApiRequest, NextApiResponse } from 'next'
import axios from './ProvideAxios';
import { AxiosError } from "axios";



export default async function getBalance(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
        const URL = `/api?module=account&action=balance&address=${req.query['address']}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
        
              
        const response = await axios.get(URL);
        console.log(response.status)
        res.status(200).json({ data: response.data })
        
        
  }