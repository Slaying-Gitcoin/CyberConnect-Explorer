import { ReactNode, useContext } from "react";
import { Box, Flex, Text, Divider, Center } from "@chakra-ui/react"
import { UserPanel } from "./UserPanel";
import { SearchBar } from "./SearchBar";
import { GraphContext } from "../context/GraphContext";

export function MainPage({ children }: { children: ReactNode }) {
  const { graphAddress, selectedAddress } = useContext(GraphContext);

  return (
    <Box>
      <Box h="70px" bg={'black'}>
        <Flex justify={{ base: "center", md: "end" }} >
          <Box flex={1} h="70px" textAlign={'right'}>
            <Text h="70px" fontWeight={600} fontSize={{ base: "3xl" }} fontFamily={"monospace"} color='white' margin={3}>
              CyberConnect Explorer
            </Text>
          </Box>
          <Center height='35px' margin={5}>
            <Divider orientation='vertical' />
          </Center>
          <Box flex={1} margin={3}>
            <SearchBar></SearchBar>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Box position={'fixed'}>
          {children}
        </Box>
        <Box display={'block'} position={'fixed'}>
          <UserPanel address={selectedAddress} />
        </Box>
      </Box>
    </Box>
  )
}