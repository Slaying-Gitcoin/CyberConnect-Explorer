import { gql } from '@apollo/client';

//Please note that this API supports pagination
export const RANKINGS = gql`
query Rankings(
                  $fromAddr:String,
                  $numberOfRankings:Int,
                  $nextCursor:String
                  ){
                    rankings(fromAddr:$fromAddr,first:$numberOfRankings,after:$nextCursor){
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
                            followerCount,
                            isP10,
                            isFollowing,
                            avatar
                          }
                        }
                    }
                  }

`;