import { gql } from '@apollo/client';


export const HOME_PAGE = gql`
query HomePage{
                homePage{
                    userCount,
                    connectionCount
                }
             }

`;