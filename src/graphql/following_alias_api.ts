import { gql } from '@apollo/client';


export const FOLLOWING_ALIAS = gql`
query FollowingAlias(
            $fromAddress:String!,
            $toAddress:String!
            ){
                followingAlias(fromAddr:$fromAddress,toAddr:$toAddress)
             }

`;