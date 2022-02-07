
import { useQuery } from "@apollo/client";
import { Box, Flex, Button, Stack, Text, Heading, Divider, Image } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "../context/GraphContext";
import { GET_IDENTITY } from "../graphql/get_identity_api";
import { Identity } from "../types/Identity";

export function UserPanel({ address }: { address: string }) {
  const { graphAddress, setGraphAddress } = useContext(GraphContext);
  const [identity, setIdentity] = useState<Identity | null>(null);

  const identityData = useQuery(GET_IDENTITY, {
    variables: {
      address: address,
    }
  }).data;

  useEffect(() => {
    if (identityData) {
      setIdentity(identityData.identity);
    }
  }, [identityData]);

  if (!identity) return null

  return (
    <Box bg={'gray'} borderRadius={'lg'} margin={0.5} padding={0.5}>
      <Box bg={'white'} color={'black'} borderRadius='lg' margin={1} padding={1}>
        <Stack spacing={4} margin={2}>
          {identity.avatar && <Image src={identity.avatar} alt={''} boxSize={'200px'} borderRadius={'lg'} />}
          <Heading size='xl'>
            {identity.ens}
          </Heading>
          <Divider />
          <Text>
            {identity.address}
          </Text>
          <Divider />
          <Flex>
            <Stack direction={'row'}>
              <Stack>
                <Text>
                  {identity.followingCount}
                </Text>
                <Text>
                  Following
                </Text>
              </Stack>
              <Divider orientation='vertical' />
              <Stack>
                <Text>
                  {identity.followerCount}
                </Text>
                <Text>
                  Followers
                </Text>
              </Stack>
            </Stack>
          </Flex>
          <Divider />
          {identity.address != graphAddress &&
            <Button bg={'#414242'} color={'white'} borderRadius={'full'} onClick={() => setGraphAddress(identity.address)}>
              Explore
            </Button>
          }
          <Divider />
          {identity.social.twitter &&
            <Button bg={'#1da1f2'} borderRadius={'full'} as={'a'} href={'https://twitter.com/' + identity.social.twitter} target={'_blank'}>
              {identity.social.twitter}
            </Button>}
          <Button bg={'#2081e2'} borderRadius={'full'} as={'a'} href={'https://opensea.io/' + identity.address} target={'_blank'}>
            OpenSea
          </Button>
          <Button bg={'#feda03'} borderRadius={'full'} as={'a'} href={'https://rarible.com/user/' + identity.address} target={'_blank'}>
            Rarible
          </Button>
          <Button bg={'#000000'} color={'white'} borderRadius={'full'} as={'a'} href={'https://foundation.app/' + identity.address} target={'_blank'}>
            Foundation
          </Button>
          <Button bg={'#000000'} color={'white'} borderRadius={'full'} as={'a'} href={'https://context.app/' + identity.address} target={'_blank'}>
            Context
          </Button>
          <Button bg={'#f5f5f5'} borderRadius={'full'} as={'a'} href={'https://etherscan.io/address/' + identity.address} target={'_blank'}>
            Etherscan
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}