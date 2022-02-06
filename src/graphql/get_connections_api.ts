import { gql } from '@apollo/client';

//Please note that this API supports pagination
export const GET_CONNECTIONS_PAGINATED = gql`
query ($address:String!, $limit:Int, $offset:String){
    identity(address:$address){
      followers(first:$limit, after:$offset){
        pageInfo{
            endCursor,
            hasNextPage
        }
        list{
          address,
          domain,
          ens,
          avatar,
          alias
        }
      }
      followings(first:$limit, after:$offset){
        pageInfo{
            endCursor,
            hasNextPage
        }
        list{
          address,
          domain,
          ens,
          avatar,
          alias
        }
      }
      friends(first:$limit, after:$offset){
        pageInfo{
            endCursor,
            hasNextPage
        }
        list{
          address,
          domain,
          ens,
          avatar,
          alias
        }
      }
    }
  }
`;
