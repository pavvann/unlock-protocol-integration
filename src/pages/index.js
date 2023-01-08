import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from 'ethers';
import Link from 'next/link';




export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const web3ModalRef = useRef();

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
    await provider.send('eth_requestAccounts', []);
    setWalletConnected(true);
  }

  // useEffect(() => {
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "goerli",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     connectWallet();
  //     const _presaleStarted = checkIfPresaleStarted();
  //     if (_presaleStarted) {
  //       checkIfPresaleEnded();
  //     }
  //     getTokenIdsMinted();

  //     const presaleEndedInterval = setInterval(async function () {
  //       const _presaleStarted = await checkIfPresaleStarted();
  //       if (_presaleStarted) {
  //         const _presaleEnded = await checkIfPresaleEnded();
  //         if (_presaleEnded) {
  //           clearInterval(presaleEndedInterval);
  //         }
  //       }
  //     }, 5 * 1000);

  //     setInterval(async function () {
  //       await getTokenIdsMinted();
  //     }, 5 * 1000);
  //   }
  // }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>Connect your wallet</button>
      );
    }

    else {
      return (
        <div>
        <Link className={styles.button} href="/Locks/create">Create a Lock</Link>
        <Link className={styles.button} href="/Locks/check">Check out Locks</Link>
        </div>
      );
    }

  };

  return (
    <div>
      <Head>
        <title>Unlock Test</title>
        <meta name = "description" content="Unlock-Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Unlock Integration Test</h1>
          <br></br>
          {renderButton()}
        </div>
      </div>
    </div>
  );

}