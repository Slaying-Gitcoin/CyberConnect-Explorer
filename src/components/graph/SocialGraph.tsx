import React, { useContext, useEffect, useState } from "react";
import Graph from "graphology";
import NodeKey, { Attributes } from "graphology-types";
import {
  useSigma, useRegisterEvents, useLoadGraph, useSetSettings, useLayoutForceAtlas2
} from "@visdauas/react-sigma-v2";
import axios from "axios";
import { animateNodes } from "sigma/utils/animate";
import ReactLoading from 'react-loading';
import useWindowDimensions from "./useWindowDimensions";
import { GraphContext } from "../../context/GraphContext";
import { TransactionSimple } from "../../types/TransactionSimple";
import { SocialConnection } from "../../types/SocialConnection";
import { Heading } from "@chakra-ui/react"

const emptyPic = '/no-avatar.png'

async function GetLabels(req: string[]) {
  return await axios.post("/api/get_labels_api", { req })
}

export const SocialGraph = () => {
  let sigma = useSigma();
  const { graphAddress, graphLoading, hideGraph, setGraphAddress, setSelectedAddress, setGraphLoading, setHideGraph, identity, socialConnections, transactions } = useContext(GraphContext);
  const { width, height } = useWindowDimensions();
  const registerEvents = useRegisterEvents();
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const [hoveredNode, setHoveredNode] = useState<NodeKey | null>(null);
  const [graph, setGraph] = useState<Graph>(new Graph());

  const forceAtlasPos2 = useLayoutForceAtlas2({
    iterations: 200,
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

  useEffect(() => {
    const generateGraph = async () => {
      if (identity === null || socialConnections === null || transactions === null) return;
      const graph = new Graph();

      graph.addNode(graphAddress, { label: identity ? identity.ens : '', type: 'image', image: identity.avatar ? identity.avatar : emptyPic, size: 80, x: 0, y: 0 });

      if (socialConnections.identity.friends.list.length != 0) {
        graph.addNode("FRIENDS", { label: "FRIENDS", type: 'image', image: '', color: '#2364ff', size: 40, x: 1, y: 1 });
        graph.addEdge(graphAddress, "FRIENDS", {});
      }

      if (socialConnections.identity.followers.list.length != 0) {
        graph.addNode("FOLLOWERS", { label: "FOLLOWERS", type: 'image', image: '', color: '#2364ff', size: 40, x: 1, y: -1 });
        graph.addEdge(graphAddress, "FOLLOWERS", {});
      }

      if (socialConnections.identity.followings.list.length != 0) {
        graph.addNode("FOLLOWING", { label: "FOLLOWING", type: 'image', image: '', color: '#2364ff', size: 40, x: -1, y: 1 });
        graph.addEdge(graphAddress, "FOLLOWING", {});
      }

      if (transactions.length != 0) {
        graph.addNode("TRANSACTIONS", { label: "TRANSACTIONS", type: 'image', image: '', color: '#2364ff', size: 40, x: -1, y: -1 });
        graph.addEdge(graphAddress, "TRANSACTIONS", {});
      }

      const sortAccordingToImportance = (u1: SocialConnection, u2: SocialConnection) => {
        const td1 = transactions.find((t: TransactionSimple) => t.from == u1.address || t.to == u1.address)
        const td2 = transactions.find((t: TransactionSimple) => t.from == u2.address || t.to == u2.address)

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

        if (u1.avatar != '' && u2.avatar == '') {
          return -1;
        }
        else if (u1.avatar == '' && u2.avatar != '') {
          return 1;
        }

        if (u1.ens != '' && u2.ens == '') {
          return -1;
        }
        else if (u1.ens == '' && u2.ens != '') {
          return 1;
        }

        return 0;
      }

      const maxFriends = 50
      let friendsSorted = [...socialConnections.identity.friends.list]
      friendsSorted.sort(sortAccordingToImportance);
      friendsSorted = friendsSorted.filter((item) => !graph.hasNode(item.address))
      friendsSorted = friendsSorted.slice(0, maxFriends);

      friendsSorted.forEach((friend: SocialConnection, i) => {
        if (!graph.hasNode(friend.address)) {
          const td = transactions.find((t: TransactionSimple) => t.from == friend.address || t.to == friend.address)
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
      followingsSorted.sort(sortAccordingToImportance);
      followingsSorted = followingsSorted.filter((item) => !graph.hasNode(item.address))
      followingsSorted = followingsSorted.slice(0, maxFollowing);

      followingsSorted.forEach((followed: SocialConnection, i) => {
        if (!graph.hasNode(followed.address)) {
          const td = transactions.find((t: TransactionSimple) => t.from == followed.address || t.to == followed.address)
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
      followersSorted.sort(sortAccordingToImportance);
      followersSorted = followersSorted.filter((item) => !graph.hasNode(item.address))
      followersSorted = followersSorted.slice(0, maxFollowers);

      followersSorted.forEach((follower: SocialConnection, i) => {
        if (!graph.hasNode(follower.address)) {
          const td = transactions.find((t: TransactionSimple) => t.from == follower.address || t.to == follower.address)
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
      let transactionsSorted = [...transactions]
      transactionsSorted.sort((t1, t2) => Math.abs(t2.value) - Math.abs(t1.value));
      transactionsSorted = transactionsSorted.slice(0, maxTransactions);

      const labels = await GetLabels(transactionsSorted.map((t: TransactionSimple) => graphAddress == t.from ? t.to : t.from))
      for (const l of labels.data) {
        transactionsSorted.find((t: TransactionSimple) => t.from == l.address || t.to == l.address)!.label = l.tag == '' ? l.entity : l.tag
      }

      transactionsSorted.forEach((transaction: TransactionSimple, i) => {
        const addr = transaction.to === graphAddress ? transaction.from : transaction.to;
        if (!graph.hasNode(addr)) {
          const td = transactions.find((t: TransactionSimple) => t.from == addr || t.to == addr)
          const size = td!.size
          const label = transaction.label == '' ? (Math.round(td!.value / Math.pow(10, 18) * 1000) / 1000).toString() + " ETH" : transaction.label
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

      if (socialConnections.identity.friends.list.length == 0 &&
        socialConnections.identity.followers.list.length == 0 &&
        socialConnections.identity.followings.list.length == 0 &&
        transactions.length == 0) {
        setHideGraph(true)
      }
    }
    generateGraph()

  }, [identity, socialConnections, transactions]);

  useEffect(() => {

    loadGraph(graph);

    animateNodes(sigma.getGraph(), forceAtlasPos2(), { duration: 3000 });

    sigma.getCamera().animatedReset();

    // Register the events
    registerEvents({
      clickNode: (event) => {
        setHoveredNode(null)
        if (event.node.startsWith('0x')) {
          setSelectedAddress(event.node);
        }
      },
      doubleClickNode: (event) => {
        if (event.node.startsWith('0x')) {
          setGraphAddress(event.node);
        }
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
          if (node === hoveredNode ||
            graph.outNeighbors(node).includes(hoveredNode.toString()) ||
            graph.inNeighbors(node).includes(hoveredNode.toString())) {

            newData.highlighted = true;
            if (newData.label == '') {
              newData.label = node
            }
            sigma.setSetting('labelWeight', 'bold');
          } else {
            newData.color = "#E2E2E2";
            newData.image = ''
            newData.label = ''
            newData.highlighted = false;
          }
        }
        else {
          sigma.setSetting('labelWeight', 'normal');
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
      {hideGraph &&
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: height! - 1,
          width: width! - 1,
        }}>
          <Heading size={'xl'}>User not found</Heading>
        </div>
      }
    </>
  );
};
