import React, { useState, useEffect, createContext } from 'react';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { GET_CONNECTIONS_PAGINATED } from '../graphql/get_connections_api';
import { GET_IDENTITY } from '../graphql/get_identity_api';
import { AllSocialConnections } from '../types/SocialConnectionsPaginated';
import { TransactionSimple } from '../types/TransactionSimple';
import { Identity } from '../types/Identity';
import { Transaction } from '../types/Transaction';
import { DEFAULT_GRAPH_ADDRESS } from '../defaults';

interface GraphContextInterface {
  graphAddress: string;
  setGraphAddress: (address: string) => void;
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  graphLoading: boolean,
  setGraphLoading: (loading: boolean) => void;
  hideGraph: boolean;
  setHideGraph: (hide: boolean) => void;
  identity: Identity | null;
  socialConnections: AllSocialConnections | null;
  transactions: TransactionSimple[] | null;
}

export const GraphContext = createContext<GraphContextInterface>({
  graphAddress: '',
  setGraphAddress: async () => undefined,
  selectedAddress: '',
  setSelectedAddress: async () => undefined,
  graphLoading: true,
  setGraphLoading: async () => undefined,
  hideGraph: false,
  setHideGraph: async () => undefined,
  identity: null,
  socialConnections: null,
  transactions: null
});

const GraphContextProvider: React.FC = ({ children }) => {
  const [graphAddress, setGraphAddressInternal] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [graphLoading, setGraphLoading] = useState<boolean>(true);
  const [hideGraph, setHideGraph] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [socialConnections, setSocialConnections] = useState<AllSocialConnections | null>(null);
  const [transactions, setTransactions] = useState<TransactionSimple[] | null>(null);

  useEffect(() => {
    const search = window.location.search;
    const address = new URLSearchParams(search).get("address");
    if (address && address.length == 42) {
      setGraphAddressInternal(address.toLowerCase());
      setSelectedAddress(address.toLowerCase());
    }
    else
    {
      setGraphAddressInternal(DEFAULT_GRAPH_ADDRESS);
      setSelectedAddress(DEFAULT_GRAPH_ADDRESS);
    }
  }, []);

  const identityData = useQuery(GET_IDENTITY, {
    variables: {
      address: graphAddress,
    }
  }).data;

  const GetTransactions = async () => {
    setTransactions(null);

    const res = await axios
      .get("/api/get_normal_transaction_list_api", {
        params: {
          address: graphAddress,
        },
      })
    let data = res.data.data.result;

    data = data.filter((td: Transaction) => td.value != 0 && td.isError == false);
    let incoming = data.filter((td: Transaction) => td.to == graphAddress);
    let outgoing = data.filter((td: Transaction) => td.from == graphAddress);

    let incomingAggregated = incoming.reduce((ts: TransactionSimple[], td: Transaction) => {
      const existing = ts.find((t: TransactionSimple) => t.from == td.from);
      if (existing) {
        existing.value = existing.value + +td.value;
      } else {
        ts.push({ from: td.from, to: td.to, value: +td.value, size: 1, label: '' });
      }
      return ts;
    }, []);

    let outgoingAggregated = outgoing.reduce((ts: TransactionSimple[], td: Transaction) => {
      const existing = ts.find((t: TransactionSimple) => t.to == td.to);
      if (existing) {
        existing.value = existing.value + +td.value * -1;
      } else {
        ts.push({ from: td.from, to: td.to, value: +td.value * -1, size: 1, label: '' });
      }
      return ts;
    }, []);
    let merged = incomingAggregated.concat(outgoingAggregated);
    let mergedAggregated = merged.reduce((ts: TransactionSimple[], td: TransactionSimple) => {
      const existing = ts.find((t: TransactionSimple) => t.from == td.to);
      if (existing) {
        existing.value = existing.value + td.value;
      }
      else {
        ts.push(td);
      }
      return ts;
    }, []);

    const newMin = 10, newMax = 40;
    const absValue = mergedAggregated.map((td: TransactionSimple) => Math.abs(td.value))
    const min = Math.min(...absValue);
    const max = Math.max(...absValue);
    const m = (newMax - newMin) / (max - min);
    const b = newMin - m * min;

    for (const td of mergedAggregated) {
      td.size = m * Math.abs(td.value) + b;
    }

    mergedAggregated.sort((a: TransactionSimple, b: TransactionSimple) => b.value - a.value);

    setTransactions(mergedAggregated);
  };

  const { fetchMore } = useQuery(GET_CONNECTIONS_PAGINATED, {
    variables: { address: graphAddress, limit: 0, offset: '0' },
    notifyOnNetworkStatusChange: true,
  })

  const GetSocialConnections = async () => {
    setSocialConnections(null)

    let hasNextPage = true
    let offset = '0'

    while (hasNextPage) {
      const { data } = await fetchMore({
        variables: { address: graphAddress, limit: 50, offset: offset },
        updateQuery: (prev: AllSocialConnections, { fetchMoreResult }) => {
          if (prev.identity === undefined || prev.identity.followers === undefined) {
            return fetchMoreResult
          }
          (fetchMoreResult as AllSocialConnections).identity.followers.list = prev.identity.followers.list.concat((fetchMoreResult as AllSocialConnections).identity.followers.list);
          (fetchMoreResult as AllSocialConnections).identity.followings.list = prev.identity.followings.list.concat((fetchMoreResult as AllSocialConnections).identity.followings.list);
          (fetchMoreResult as AllSocialConnections).identity.friends.list = prev.identity.friends.list.concat((fetchMoreResult as AllSocialConnections).identity.friends.list);
          return fetchMoreResult
        }
      })

      const identity = (data as AllSocialConnections).identity

      hasNextPage = identity.followers.pageInfo.hasNextPage || identity.followings.pageInfo.hasNextPage || identity.friends.pageInfo.hasNextPage
      offset = Math.max(+identity.followers.pageInfo.endCursor, +identity.followings.pageInfo.endCursor, +identity.friends.pageInfo.endCursor).toString()

      // display only the first 500 social connections, because it takes too much time to query more
      // TODO: make querying asynchronous or somehow fix this
      if (Math.max(identity.followers.list.length, identity.followings.list.length, identity.friends.list.length) >= 500) {
        hasNextPage = false
      }

      if (!hasNextPage) {
        setSocialConnections(data)
      }
    }
  }

  useEffect(() => {
    if (graphAddress == '') return;
    setGraphLoading(true);
    setIdentity(null);
    GetSocialConnections();
    GetTransactions();
  }, [graphAddress]);

  useEffect(() => {
    if (identityData) {
      setIdentity(identityData.identity);
    }
  }, [identityData]);

  const setGraphAddress = (address: string) => {
    window.location.href = `/?address=${address}`;
  }

  return (
    <GraphContext.Provider
      value={{
        graphAddress,
        setGraphAddress,
        selectedAddress,
        setSelectedAddress,
        graphLoading,
        setGraphLoading,
        hideGraph,
        setHideGraph,
        identity,
        socialConnections,
        transactions,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export default GraphContextProvider;
