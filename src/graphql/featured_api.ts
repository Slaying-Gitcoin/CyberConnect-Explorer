import { gql } from '@apollo/client';


export const FEATURED = gql`
query Featured(
            $fromAddress:String
            ){
                featured(fromAddr:$fromAddress){
                    address,
                    domain,
                    ens,
                    recommendationReason,
                    followerCount,
                    isFollowing,
                    avatar
                }
             }

`;