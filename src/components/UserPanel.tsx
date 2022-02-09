
import { useQuery } from "@apollo/client";
import { Box, Flex, Button, Stack, Text, Heading, Divider, Image, Spacer } from "@chakra-ui/react"
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
    <Box bg={'black'} margin={0.5} padding={0.5}>
      <Box bg={'white'} color={'black'} margin={1} padding={1}>
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

          {identity.social.twitter &&
            <Box bg={'#1da1f2'} borderRadius={'full'} as={'a'} href={'https://twitter.com/' + identity.social.twitter} target={'_blank'} padding={1}>
              <Flex direction={'row'}>
                <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                  <Image src={'/icons/twitter.png'} alt={''} boxSize={'30px'} />
                </Box>
                <Text color={'white'} fontWeight={'bold'} margin={1}>
                  {'@' + identity.social.twitter}
                </Text>
              </Flex>
            </Box>
          }

          <Box bg={'#2081e2'} borderRadius={'full'} as={'a'} href={'https://opensea.io/' + identity.address} target={'_blank'} padding={1}>
            <Flex direction={'row'}>
              <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                <Image src={'/icons/opensea.png'} alt={''} boxSize={'30px'} />
              </Box>
              <Text color={'white'} fontWeight={'bold'} margin={1}>
                OpenSea
              </Text>
            </Flex>
          </Box>

          <Box bg={'#feda03'} borderRadius={'full'} as={'a'} href={'https://rarible.com/user/' + identity.address} target={'_blank'} padding={1}>
            <Flex direction={'row'}>
              <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                <Image src={'/icons/rarible.png'} alt={''} boxSize={'30px'} />
              </Box>
              <Text color={'white'} fontWeight={'bold'} margin={1}>
                Rarible
              </Text>
            </Flex>
          </Box>

          <Box bg={'#000000'} color={'white'} borderRadius={'full'} as={'a'} href={'https://foundation.app/' + identity.address} target={'_blank'} padding={1}>
            <Flex direction={'row'}>
              <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                <Image src={'/icons/foundation.png'} alt={''} boxSize={'30px'} />
              </Box>
              <Text color={'white'} fontWeight={'bold'} margin={1}>
                Foundation
              </Text>
            </Flex>
          </Box>

          <Box bg={'#000000'} color={'white'} borderRadius={'full'} as={'a'} href={'https://context.app/' + identity.address} target={'_blank'} padding={1}>
            <Flex direction={'row'}>
              <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                <Image src={'/icons/context.png'} alt={''} boxSize={'30px'} />
              </Box>
              <Text color={'white'} fontWeight={'bold'} margin={1}>
                Context
              </Text>
            </Flex>
          </Box>

          <Box bg={'#9c9b9a'} borderRadius={'full'} as={'a'} href={'https://etherscan.io/address/' + identity.address} target={'_blank'} padding={1}>
            <Flex direction={'row'}>
              <Box borderRadius={'full'} bg={'white'} padding={0.5}>
                <Image src={'/icons/etherscan.ico'} alt={''} boxSize={'30px'} />
              </Box>
              <Text color={'white'} fontWeight={'bold'} margin={1}>
                Etherscan
              </Text>
            </Flex>
          </Box>

          {identity.address != graphAddress &&
            <>
              <Divider /><Button bg={'#414242'} color={'white'} borderRadius={'full'} onClick={() => setGraphAddress(identity.address)}>
                <Text color={'white'} fontWeight={'bold'} margin={1}>
                  Open in Explorer
                </Text> 
              </Button>
            </>
          }
        </Stack>
      </Box>
    </Box>
  )
}