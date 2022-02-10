import type { NextPage } from 'next'
import Head from 'next/head'
import { Graph } from '../components/graph/Graph'
import { MainPage } from '../components/MainPage'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CyberConnect Explorer</title>
        <meta name="description" content="Explore CyberConnect's decentralized social graph protocol" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage>
        <Graph/>
      </MainPage>
    </>
  );
};

export default Home;
