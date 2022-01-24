import { gql } from '@apollo/client';


export const FOLLOW_STATUS = gql`
query FollowStatus(
            $fromAddress:String!,
            $toAddress:String!
            ){
                followStatus(fromAddr:$fromAddress,toAddr:$toAddress){
                    isFollowed,
                    isFollowing
                }
             }

`;