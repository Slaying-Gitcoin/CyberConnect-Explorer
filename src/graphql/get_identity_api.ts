import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

export interface UserIdentity {
  address: string;
  domain: string;
  ens: string;
}

interface UserIdentityData {
  userIdentity: UserIdentity;
}

interface IdentityVars {
  address: string;
}

//Please note that this API supports pagination
export const GET_IDENTITY = gql`
query GetIdentity($address:String!,
                  $numberOfFollowers:Int,
                  $nextCursorFollowers:String,
                  $numberOfFollowings:Int,
                  $nextCursorFollowings:String,
                  $numberOfFriends:Int,
                  $nextCursorFriends:String){
    identity(address:$address){
      address,
      domain,
      ens,
      social{
        twitter
      }
      avatar,
      joinTime,
      followerCount,
      followingCount,
      followers(first:$numberOfFollowers, after:$nextCursorFollowers){
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
          alias,
          namespace,
          lastModifiedTime
        }
      }
      followings(first:$numberOfFollowings, after:$nextCursorFollowings){
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
          alias,
          namespace,
          lastModifiedTime
        }
      }
      friends(first:$numberOfFriends, after:$nextCursorFriends){
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
          alias,
          namespace,
          lastModifiedTime
        }
      }
    }
  }
`;