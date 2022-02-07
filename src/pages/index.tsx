import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { Graph } from '../components/graph/Graph'
import { MainPage } from '../components/MainPage'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>CyberConnect Explorer</title>
        <meta name="description" content="Explore the CyberConnect blockchain powered social network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage>
        <Graph/>
      </MainPage>
    </div>
  );
};

export default Home;
