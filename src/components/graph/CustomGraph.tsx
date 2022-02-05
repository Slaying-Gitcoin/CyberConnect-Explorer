import React, { ReactNode, useContext, useEffect, useState } from "react";
import Graph from "graphology";
import NodeKey, { Attributes } from "graphology-types";
import {
  useSigma, useRegisterEvents, useLoadGraph, useSetSettings, useLayoutForceAtlas2
} from "@visdauas/react-sigma-v2";
import "@visdauas/react-sigma-v2/lib/react-sigma-v2.css";
import { useApolloClient, useQuery } from "@apollo/client";
import axios from "axios";
import { GET_IDENTITY } from "../../graphql/get_identity_api";
import { Web3Context } from "../../context/Web3Context";
import { animateNodes } from "sigma/utils/animate";
import { GET_CONNECTIONS_PAGINATED } from "../../graphql/get_connections_api";
import ReactLoading from 'react-loading';
import useWindowDimensions from "./useWindowDimensions";

interface MyCustomGraphProps {
  children?: ReactNode;
}

type SocialConnection = {
  address: string,
  alias: string,
  avatar: string,
  domain: string,
  ens: string,
}

type Transaction = {
  blockHash: string,
  blockNumber: number,
  confirmations: number,
  contractAddress: string,
  cumulativeGasUsed: number,
  from: string,
  gas: number,
  gasPrice: number,
  gasUsed: number,
  hash: string,
  input: string,
  isError: boolean,
  nonce: number,
  timeStamp: number,
  to: string,
  transactionIndex: number,
  txreceipt_status: string,
  value: number,
}

type TransactionSimple = {
  from: string,
  to: string,
  value: number,
  size: number,
}

type SocialConnections = {
  identity: {
    followers: SocialConnectionList
    followings: SocialConnectionList
    friends: SocialConnectionList

  }
}

type SocialConnectionList = {
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string,
    endCursor: string,
  },
  list: SocialConnection[]
}

const emptyPic = '/empty-user-pic.png'

export const CustomGraph: React.FC<MyCustomGraphProps> = ({ children }) => {
  const sigma = useSigma();
  const { graphAddress, graphLoading, setGraphAddress, setGraphLoading } = useContext(Web3Context);
  const { width, height } = useWindowDimensions();

  const registerEvents = useRegisterEvents();
  const loadGraph = useLoadGraph();

  const setSettings = useSetSettings();

  const [hoveredNode, setHoveredNode] = useState<NodeKey | null>(null);

  const identityData = useQuery(GET_IDENTITY, {
    variables: {
      address: graphAddress,
    }
  }).data;

  const [transactionData, setTransactionData] = useState<TransactionSimple[]>();

  const [graph, setGraph] = useState<Graph>(new Graph());

  const forceAtlasPos2 = useLayoutForceAtlas2({
    iterations: 500,
    settings: {
      gravity: 1,
      adjustSizes: true,
      scalingRatio: 1,
      linLogMode: false,
      barnesHutOptimize: true,
      strongGravityMode: false,
      outboundAttractionDistribution: false,
    }
  }).positions;
  const [transactionsLoaded, setTransactionsLoaded] = useState(false);

  useEffect(() => {
    const getTransactions = async () => {
      const res = await axios
        .get("/api/get_normal_transaction_list_api", {
          params: {
            address: graphAddress,
          },
        })
      let data = res.data.data.result;
      console.log(data)
      data = data.filter((td: Transaction) => td.value != 0 && td.isError == false);
      let incoming = data.filter((td: Transaction) => td.to == graphAddress);
      let outgoing = data.filter((td: Transaction) => td.from == graphAddress);

      let incomingAggregated = incoming.reduce((ts: TransactionSimple[], td: Transaction) => {
        const existing = ts.find((t: TransactionSimple) => t.from == td.from);
        if (existing) {
          existing.value = existing.value + +td.value;
        } else {
          ts.push({ from: td.from, to: td.to, value: +td.value, size: 1 });
        }
        return ts;
      }, []);

      let outgoingAggregated = outgoing.reduce((ts: TransactionSimple[], td: Transaction) => {
        const existing = ts.find((t: TransactionSimple) => t.to == td.to);
        if (existing) {
          existing.value = existing.value + +td.value * -1;
        } else {
          ts.push({ from: td.from, to: td.to, value: +td.value * -1, size: 1 });
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

      setTransactionData(mergedAggregated);
      console.log(mergedAggregated)
      setTransactionsLoaded(true);
    };

    getTransactions();

  }, [graphAddress]);

  const [socialConnections, setSocialConnections] = useState<SocialConnections>();

  const { fetchMore } = useQuery(GET_CONNECTIONS_PAGINATED, {
    variables: { address: graphAddress, limit: 0, offset: '0' },
    notifyOnNetworkStatusChange: true,
  })

  const [followersInitialized, setFollowersInitialized] = useState(false);
  const [followersLoaded, setFollowersLoaded] = useState(false);

  const fetchRest = async () => {
    setSocialConnections(undefined)
    let hasNextPage = true
    let offset = '0'

    while (hasNextPage) {
      const { data } = await fetchMore({
        variables: { address: graphAddress, limit: 50, offset: offset },
        updateQuery: (prev: SocialConnections, { fetchMoreResult }) => {
          if (prev.identity.followers === undefined) {
            return fetchMoreResult
          }
          (fetchMoreResult as SocialConnections).identity.followers.list = prev.identity.followers.list.concat((fetchMoreResult as SocialConnections).identity.followers.list);
          (fetchMoreResult as SocialConnections).identity.followings.list = prev.identity.followings.list.concat((fetchMoreResult as SocialConnections).identity.followings.list);
          (fetchMoreResult as SocialConnections).identity.friends.list = prev.identity.friends.list.concat((fetchMoreResult as SocialConnections).identity.friends.list);
          return fetchMoreResult
        }
      })

      const identity = (data as SocialConnections).identity

      hasNextPage = identity.followers.pageInfo.hasNextPage || identity.followings.pageInfo.hasNextPage || identity.friends.pageInfo.hasNextPage
      offset = Math.max(+identity.followers.pageInfo.endCursor, +identity.followings.pageInfo.endCursor, +identity.friends.pageInfo.endCursor).toString()
      if (identity.followers.list.length >= 500) {
        hasNextPage = false
      }
      setSocialConnections(data)
      console.log(data)
    }
    setFollowersLoaded(true)
  }

  useEffect(() => {
    fetchRest()
  }, [graphAddress]);

  useEffect(() => {
    if (!transactionsLoaded || !followersLoaded || socialConnections === undefined || transactionData === undefined) return;
    const graph = new Graph();

    graph.addNode("USER", { label: identityData.ens, type: 'image', image: identityData.identity.avatar, size: 100, x: 0, y: 0 });
    graph.addNode("FRIENDS", { label: "FRIENDS", type: 'image', image: '', size: 50, x: 1, y: 1 });
    graph.addNode("FOLLOWERS", { label: "FOLLOWERS", type: 'image', image: '', size: 50, x: 1, y: -1 });
    graph.addNode("FOLLOWING", { label: "FOLLOWING", type: 'image', image: '', size: 50, x: -1, y: 1 });
    graph.addNode("TRANSACTIONS", { label: "TRANSACTIONS", type: 'image', image: '', size: 50, x: -1, y: -1 });

    graph.addEdge("USER", "FRIENDS", {});
    graph.addEdge("USER", "FOLLOWERS", {});
    graph.addEdge("USER", "FOLLOWING", {});
    graph.addEdge("USER", "TRANSACTIONS", {});

    const maxFriends = 50
    let friendsSorted = [...socialConnections.identity.friends.list]
    friendsSorted.sort((f1, f2) => {
      const td1 = transactionData.find((t: TransactionSimple) => t.from == f1.address || t.to == f1.address)
      const td2 = transactionData.find((t: TransactionSimple) => t.from == f2.address || t.to == f2.address)

      if (td1 && td2) {
        if (td1.value > td2.value) return -1
        if (td1.value < td2.value) return 1
      }
      else if (td1) {
        return -1;
      }
      else if (td2) {
        return 1;
      }

      if (f1.avatar != '' && f2.avatar == '') {
        return -1;
      }
      else if (f1.avatar == '' && f2.avatar != '') {
        return 1;
      }

      if (f1.ens != '' && f2.ens == '') {
        return -1;
      }
      else if (f1.ens == '' && f2.ens != '') {
        return 1;
      }

      return 0;
    });
    friendsSorted = friendsSorted.filter((item) => !graph.hasNode(item.address))
    friendsSorted = friendsSorted.slice(0, maxFriends);

    friendsSorted.forEach((friend: SocialConnection, i) => {
      if (!graph.hasNode(friend.address)) {
        const td = transactionData.find((t: TransactionSimple) => t.from == friend.address || t.to == friend.address)
        const size = td ? td?.size + 10 : 15
        const label = td ? (Math.round(td.value / Math.pow(10, 18) * 1000) / 1000).toString() + " ETH" : friend.ens
        const image = friend.avatar != '' ? friend.avatar : (!td ? emptyPic : '')
        const color = !td ? '' : (td?.value! > 0 ? '#00ff00' : '#ff0000')

        graph.addNode(friend.address, { label: label, type: 'image', image: image, size: size, color: color });
        graph.addEdge("FRIENDS", friend.address);

        const angle = (i * 2 * Math.PI) / maxFriends;
        graph.setNodeAttribute(friend.address, "x", 1 + .5 * Math.cos(angle));
        graph.setNodeAttribute(friend.address, "y", 1 + .5 * Math.sin(angle));
      }
    });

    const maxFollowing = 50
    let followingsSorted = [...socialConnections.identity.followings.list]
    followingsSorted.sort((f1, f2) => {
      const td1 = transactionData.find((t: TransactionSimple) => t.from == f1.address || t.to == f1.address)
      const td2 = transactionData.find((t: TransactionSimple) => t.from == f2.address || t.to == f2.address)

      if (td1 && td2) {
        if (td1.value > td2.value) return -1
        if (td1.value < td2.value) return 1
      }
      else if (td1) {
        return -1;
      }
      else if (td2) {
        return 1;
      }

      if (f1.avatar != '' && f2.avatar == '') {
        return -1;
      }
      else if (f1.avatar == '' && f2.avatar != '') {
        return 1;
      }

      if (f1.ens != '' && f2.ens == '') {
        return -1;
      }
      else if (f1.ens == '' && f2.ens != '') {
        return 1;
      }

      return 0;
    });

    followingsSorted = followingsSorted.filter((item) => !graph.hasNode(item.address))
    followingsSorted = followingsSorted.slice(0, maxFollowing);

    followingsSorted.forEach((followed: SocialConnection, i) => {
      if (!graph.hasNode(followed.address)) {
        const td = transactionData.find((t: TransactionSimple) => t.from == followed.address || t.to == followed.address)
        const size = td ? td?.size + 10 : 15
        const label = td ? (Math.round(td.value / Math.pow(10, 18) * 1000) / 1000).toString() + " ETH" : followed.ens
        const image = followed.avatar != '' ? followed.avatar : (!td ? emptyPic : '')
        const color = !td ? '' : (td?.value! > 0 ? '#00ff00' : '#ff0000')

        graph.addNode(followed.address, { label: label, type: 'image', image: image, size: size, color: color });
        graph.addEdge("FOLLOWING", followed.address);

        const angle = (i * 2 * Math.PI) / maxFollowing;
        graph.setNodeAttribute(followed.address, "x", -1 + .5 * Math.cos(angle));
        graph.setNodeAttribute(followed.address, "y", 1 + .5 * Math.sin(angle));
      }
    });

    const maxFollowers = 50
    let followersSorted = [...socialConnections.identity.followers.list]
    followersSorted.sort((f1, f2) => {
      const td1 = transactionData.find((t: TransactionSimple) => t.from == f1.address || t.to == f1.address)
      const td2 = transactionData.find((t: TransactionSimple) => t.from == f2.address || t.to == f2.address)

      if (td1 && td2) {
        if (td1.value > td2.value) return -1
        if (td1.value < td2.value) return 1
      }
      else if (td1) {
        return -1;
      }
      else if (td2) {
        return 1;
      }

      if (f1.avatar != '' && f2.avatar == '') {
        return -1;
      }
      else if (f1.avatar == '' && f2.avatar != '') {
        return 1;
      }

      if (f1.ens != '' && f2.ens == '') {
        return -1;
      }
      else if (f1.ens == '' && f2.ens != '') {
        return 1;
      }

      return 0;
    });

    followersSorted = followersSorted.filter((item) => !graph.hasNode(item.address))
    followersSorted = followersSorted.slice(0, maxFollowers);

    followersSorted.forEach((follower: SocialConnection, i) => {
      if (!graph.hasNode(follower.address)) {
        const td = transactionData.find((t: TransactionSimple) => t.from == follower.address || t.to == follower.address)
        const size = td ? td?.size + 10 : 15
        const label = td ? (Math.round(td.value / Math.pow(10, 18) * 1000) / 1000).toString() + " ETH" : follower.ens
        const image = follower.avatar != '' ? follower.avatar : (!td ? emptyPic : '')
        const color = !td ? '' : (td?.value! > 0 ? '#00ff00' : '#ff0000')

        graph.addNode(follower.address, { label: label, type: 'image', image: image, size: size, color: color });
        graph.addEdge("FOLLOWERS", follower.address);

        const angle = (i * 2 * Math.PI) / maxFollowers;
        graph.setNodeAttribute(follower.address, "x", 1 + .5 * Math.cos(angle));
        graph.setNodeAttribute(follower.address, "y", -1 + .5 * Math.sin(angle));
      }
    });

    const maxTransactions = 50
    let transactionsSorted = [...transactionData]
    transactionsSorted.sort((t1, t2) => Math.abs(t2.value) - Math.abs(t1.value));
    transactionsSorted = transactionsSorted.slice(0, maxTransactions);

    transactionsSorted.forEach((transaction: TransactionSimple, i) => {
      const addr = transaction.to === graphAddress ? transaction.from : transaction.to;
      if (!graph.hasNode(addr)) {
        const td = transactionData.find((t: TransactionSimple) => t.from == addr || t.to == addr)
        const size = td!.size
        const label = td ? (Math.round(td.value / Math.pow(10, 18) * 1000) / 1000).toString() + " ETH" : ''
        const color = td?.value! > 0 ? '#00ff00' : '#ff0000'

        graph.addNode(addr, { label: label, type: 'image', image: '', size: size, color: color });
        graph.addEdge("TRANSACTIONS", addr);

        const angle = (i * 2 * Math.PI) / maxTransactions;
        graph.setNodeAttribute(addr, "x", -1 + .5 * Math.cos(angle));
        graph.setNodeAttribute(addr, "y", -1 + .5 * Math.sin(angle));
      }
    });

    setGraph(graph);
    setGraphLoading(false);
  }, [graphAddress, transactionsLoaded, followersLoaded]);

  useEffect(() => {
    loadGraph(graph);

    //setInterval(() => {
      animateNodes(sigma.getGraph(), forceAtlasPos2(), { duration: 0 });
    //}, 500);

    sigma.getCamera().animatedReset();

    // Register the events
    registerEvents({
      clickNode: (event) => {
        sigma.clear();
        setGraph(new Graph());
        setSocialConnections(undefined);
        setFollowersLoaded(false);
        setFollowersInitialized(false);
        setTransactionsLoaded(false);
        setTransactionData(undefined);
        setGraphLoading(true);
        setGraphAddress(event.node == 'USER' ? graphAddress : event.node);
      },
      enterNode: (event: { node: any; }) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });
  }, [graph]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node: any, data: { [x: string]: any; highlighted?: any; }) => {
        const graph = sigma.getGraph();
        const newData: Attributes = { ...data, highlighted: data.highlighted || false };

        if (hoveredNode) {
          if (node === hoveredNode) {
            newData.highlighted = true;
            newData.label = node;
          } else {
            newData.color = "#E2E2E2";
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge: any, data: any) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode.toString())) {
          newData.hidden = true;
        }
        return newData;
      }
    });
  }, [hoveredNode]);

  return (
    <>
      {graphLoading &&
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: height! - 1,
          width: width! - 1
        }}>
          <ReactLoading type={'spin'} color={'#000000'} height={'50px'} width={'50px'} />
        </div>
      }
      {children}
    </>
  );
};
