import { gql } from '@apollo/client';

export enum TAG {
  PLAZA,
  FEATURED,
  NFTMARKET
}

export class TagsInput {
  list: TAG[];
  constructor(list: TAG[]) {
    this.list = list
  }
}

//Please note that this API supports pagination
export const POPULAR = gql`
query Popular(
                  $fromAddr:String,
                  $numberOfPopular:Int,
                  $nextCursor:String,
                  $tags:TagsInput!
                  ){
                    popular(fromAddr:$address,first:$numberOfPopular,after:$nextCursor,filter:$filter,tags:$tags){
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
                            recommendationReason,
                            followerCount,
                            isFollowing,
                            avatar
                          }
                        }
                    }
`;