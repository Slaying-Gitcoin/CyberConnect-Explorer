import { gql } from '@apollo/client';


export enum RecommFilter {
    SOCIAL,
    NFT,
    DEFI,
    GAME
    }

//Please note that this API supports pagination
export const GET_RECOMMENDATIONS = gql`
query GetRecommendations(
                  $address:String!,
                  $numberOfRecomms:Int,
                  $nextCursor:String,
                  $filter:RecommFilter
                  ){
                    recommendations(address:$address,first:$numberOfRecomms,after:$nextCursor,filter:$filter){
                        result,
                      data{
                        pageInfo{
                          startCursor,
                          endCursor,
                          hasNextPage,
                          hasPreviousPage
                        }
                        list{
                          address,
                          domain,
                          ens,
                          avatar,
                          recommendationReason,
                          followerCount
                        }
                      }
                    }
                  }

`;