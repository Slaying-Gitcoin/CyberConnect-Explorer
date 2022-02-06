import { ReactNode } from "react";
import { Box, Flex, useDisclosure, FlexProps, Button, Stack, Text, Divider, Center } from "@chakra-ui/react"
import { SidePanel } from "./SidePanel";
import { SearchBar } from "./SearchBar";

export function MainPage({ children }: { children: ReactNode }) {
  return (
    <Box>
      <Box h="70px" bg={'black'}>
        <Flex justify={{ base: "center", md: "end" }} >
          <Box flex={1} h="70px">
            <Text h="70px" fontWeight={600} fontSize={{ base: "3xl" }} fontFamily={"monospace"} color='white' align={'right'} verticalAlign={'middle'} >
              CyberConnect Explorer
            </Text>
          </Box>
          <Center height='35px' margin={5}>
            <Divider orientation='vertical' />
          </Center>
          <Box flex={1}>
            <SearchBar></SearchBar>
          </Box>
        </Flex>
      </Box>
      <Flex direction={'row'}>
        <Box flex={1} bg={'black'} >
          <SidePanel />
        </Box>
        <Box flex={3}>
          {children}
        </Box>
        <Box flex={1} bg={'black'} >
          <SidePanel />
        </Box>
      </Flex>
    </Box>
  )
}