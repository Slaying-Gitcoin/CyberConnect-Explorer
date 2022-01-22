import { useQuery, gql } from '@apollo/client';


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

export const GET_IDENTITY = gql`
query GetIdentity($address:String!){
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
      followers{
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
      followings{
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
      friends{
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

export function GetIdentity(address:string){
    const { loading, data } = useQuery<UserIdentityData, IdentityVars>(
        GET_IDENTITY,
        { variables: { address: address } }
      );

      console.log(data?.userIdentity)
      return {loading, data}
}