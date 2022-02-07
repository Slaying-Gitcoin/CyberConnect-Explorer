import { Box, Flex, useDisclosure, FlexProps, Button, Stack, Text, Input } from "@chakra-ui/react"
import { SetStateAction, useContext, useState } from "react"
import { GraphContext } from "../context/GraphContext";
import { Web3Context } from "../context/Web3Context";

export function SearchBar() {
  const { getAddressByEns } = useContext(Web3Context);
  const { graphAddress, setGraphAddress } = useContext(GraphContext);

  const [value, setValue] = useState('')
  const handleChange = async (event: { target: { value: string } }) => {
    const newValue = event.target.value
    setValue(newValue)
    if (newValue != '' && newValue != value && newValue.length < 64) {
      try {
        const ens = await getAddressByEns(newValue)
        if (ens) {
          console.log(ens)
          setGraphAddress(ens)
        }
        else if (newValue.length == 42) {
          setGraphAddress(newValue)
        }

      } catch (error) {}
    }
  }

  return (
    <>
      <Input
        width={'50%'}
        value={value}
        onChange={handleChange}
        placeholder='Search by ENS / address'
        variant='flushed'
        size={'lg'}
        color={'white'}
      />
    </>
  )
}