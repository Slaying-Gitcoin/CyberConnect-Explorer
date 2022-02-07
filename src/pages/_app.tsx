import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql/apollo-client'
import Web3ContextProvider from '../context/Web3Context'
import GraphContextProvider from '../context/GraphContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Web3ContextProvider>
          <GraphContextProvider>
            <Component {...pageProps} />
          </GraphContextProvider>
        </Web3ContextProvider>
      </ApolloProvider>
    </ChakraProvider>
  )
}

export default MyApp
