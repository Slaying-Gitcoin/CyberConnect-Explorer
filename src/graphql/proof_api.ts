import { gql } from '@apollo/client';

export const PROOF = gql`
query Proof(
            $fromAddress:String!,
            $toAddress:String!
            ){
                proof(fromAddr:$fromAddress,toAddr:$toAddress)
             }

`;