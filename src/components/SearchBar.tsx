import { Box, Flex, useDisclosure, FlexProps, Button, Stack, Text, Input } from "@chakra-ui/react"
import { SetStateAction, useContext, useState } from "react"
import { Web3Context } from "../context/Web3Context";

export function SearchBar() {
  const { graphAddress, setGraphAddress, getAddressByEns } = useContext(Web3Context);

  const [value, setValue] = useState('')
  const handleChange = async (event: { target: { value: string } }) => {
    const newValue = event.target.value
    if (newValue != '' && newValue != value) {
      const ens = await getAddressByEns(newValue)
      if (ens) {
        setValue(ens)
        setGraphAddress(ens)
      }
      else if (newValue.length == 42) {
        setValue(newValue)
        setGraphAddress(newValue)
      }
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