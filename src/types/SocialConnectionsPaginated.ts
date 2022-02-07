import { SocialConnection } from "./SocialConnection"

export type SocialConnectionsPaginated = {
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string,
    endCursor: string,
  },
  list: SocialConnection[]
}

export type AllSocialConnections = {
  identity: {
    followers: SocialConnectionsPaginated
    followings: SocialConnectionsPaginated
    friends: SocialConnectionsPaginated
  }
}