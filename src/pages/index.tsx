import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { Graph } from "../components/graph/Graph";
import { MainPage } from "../components/MainPage";
import { GetAssetEventsTest } from "../components/test/GetAssetEvents";
import { GetAssetsTest } from "../components/test/GetAssetsTest";

const Home: NextPage = () => {
  return (
    <div>
      <GetAssetEventsTest />
      <Head>
        <title>CyberConnect Explorer</title>
        <meta
          name="description"
          content="Explore the CyberConnect blockchain powered social network"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Home;
