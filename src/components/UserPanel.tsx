import { useQuery } from "@apollo/client";
import {
  Box,
  Flex,
  Button,
  Stack,
  Text,
  Heading,
  Divider,
  Image,
  HStack,
  CloseButton,
  Spacer,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { GraphContext } from "../context/GraphContext";
import { GET_IDENTITY } from "../graphql/get_identity_api";
const axios = require("axios").default;
import { Identity } from "../types/Identity";
import { ethers } from "ethers";

export function UserPanel({ address }: { address: string }) {
  const { graphAddress, setGraphAddress, setSelectedAddress } =
    useContext(GraphContext);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const identityData = useQuery(GET_IDENTITY, {
    variables: {
      address: address,
    },
  }).data;

  useEffect(() => {
    if (identityData) {
      setIdentity(identityData.identity);
    }
  }, [identityData]);

  if (address === "") return null

  axios
    .get("/api/get_balance_api", {
      params: {
        address: address,
      },
    })
    .then(function (response: any) {
      const balanceData = response.data.data.result;
      const niceData = ethers.utils.formatEther(balanceData);
      setBalance(parseFloat(niceData).toFixed(4));
    })
    .catch(function (error: { response: any }) {
      // handle error
      console.log(error.response);
    });

  const ClosePanel = () => {
    setSelectedAddress("");
    setIdentity(null);
  };

  if (!identity) return null;

  return (
    <Box bg={"black"} margin={0.5} padding={0.5} maxW={350}>
      <Box bg={"white"} color={"black"} margin={1} padding={1}>
        <Stack spacing={4} margin={2}>
          <Flex direction={"column"}>
            <Box alignSelf={"flex-end"}>
              <CloseButton onClick={ClosePanel} />
            </Box>
            {identity.avatar && (
              <Box display={"flex"}>
                <Box bg={"black"} padding={0.5} borderRadius={"lg"}>
                  <Box bg={"white"} padding={0.5} borderRadius={"lg"}>
                    <Image
                      src={identity.avatar}
                      alt={""}
                      boxSize={"200px"}
                      borderRadius={"lg"}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Flex>

          <Heading size="lg">{identity.ens}</Heading>
          <Divider />

          <Text fontSize={"small"}>{identity.address}</Text>
          <Divider />

          <Flex direction={"row"}>
            <Text fontSize={"medium"}>{balance}</Text>
            <Spacer />
            <Image src={"/icons/eth.png"} alt={""} boxSize={"30px"} />
          </Flex>

          <Divider />

          <Flex direction={"row"} textAlign={"center"} fontWeight={"bold"}>
            <Spacer />
            <Stack>
              <Text>{identity.followingCount}</Text>
              <Text color={"#989898"}>Following</Text>
            </Stack>
            <Spacer />
            <Stack>
              <Text>{identity.followerCount}</Text>
              <Text color={"#989898"}>Followers</Text>
            </Stack>
            <Spacer />
          </Flex>
          <Divider />

          {identity.social.twitter && (
            <Box
              bg={"#1da1f2"}
              borderRadius={"full"}
              as={"a"}
              href={"https://twitter.com/" + identity.social.twitter}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image src={"/icons/twitter.png"} alt={""} boxSize={"30px"} />
                </Box>
                <Text color={"white"} fontWeight={"bold"} margin={1}>
                  {"@" + identity.social.twitter}
                </Text>
              </Flex>
            </Box>
          )}

          <HStack>
            <Box
              bg={"#2081e2"}
              borderRadius={"full"}
              as={"a"}
              href={"https://opensea.io/" + identity.address}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image src={"/icons/opensea.png"} alt={""} boxSize={"30px"} />
                </Box>
              </Flex>
            </Box>

            <Box
              bg={"#feda03"}
              borderRadius={"full"}
              as={"a"}
              href={"https://rarible.com/user/" + identity.address}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image src={"/icons/rarible.png"} alt={""} boxSize={"30px"} />
                </Box>
              </Flex>
            </Box>

            <Box
              bg={"#000000"}
              color={"white"}
              borderRadius={"full"}
              as={"a"}
              href={"https://foundation.app/" + identity.address}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image
                    src={"/icons/foundation.png"}
                    alt={""}
                    boxSize={"30px"}
                  />
                </Box>
              </Flex>
            </Box>

            <Box
              bg={"#000000"}
              color={"white"}
              borderRadius={"full"}
              as={"a"}
              href={"https://context.app/" + identity.address}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image src={"/icons/context.png"} alt={""} boxSize={"30px"} />
                </Box>
              </Flex>
            </Box>

            <Box
              bg={"#9c9b9a"}
              borderRadius={"full"}
              as={"a"}
              href={"https://etherscan.io/address/" + identity.address}
              target={"_blank"}
              padding={1}
            >
              <Flex direction={"row"}>
                <Box borderRadius={"full"} bg={"white"} padding={0.5}>
                  <Image
                    src={"/icons/etherscan.ico"}
                    alt={""}
                    boxSize={"30px"}
                  />
                </Box>
              </Flex>
            </Box>
          </HStack>

          {identity.address != graphAddress && (
            <>
              <Divider />
              <Button
                bg={"#414242"}
                color={"white"}
                borderRadius={"full"}
                onClick={() => setGraphAddress(identity.address)}
              >
                <Text color={"white"} fontWeight={"bold"} margin={1}>
                  Open in Explorer
                </Text>
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
