import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import { WalletService } from '@unlock-protocol/unlock-js';
import { ethers } from 'ethers';
import Link from 'next/link';

export default function create() {
    const networks = {
        5: {
            unlockAddress: "0x627118a4fB747016911e5cDA82e2E77C531e8206", // Smart contracts docs include all addresses on all networks
            provider: "https://rpc.unlock-protocol.com/5",
        },
    };

    const [lockName, setLockName] = useState("")
    const [walletConnected, setWalletConnected] = useState(false);
    const createLock = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        if (provider.getNetwork() != 5) {
            window.alert("Change network to Goerli");
        }
        const signer = provider.getSigner();
        // create unlock-protocol lock
        const walletService = new WalletService(networks);

        // Connect to a provider with a wallet
        await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const lock = await walletService.createLock(
            {
                maxNumberOfKeys: 100,
                name: lockName,
                expirationDuration: 864000,
                keyPrice: "0.01", // Key price needs to be a string
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(lock)
    }
    const connectWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        await provider.send('eth_requestAccounts', []);
        setWalletConnected(true);
    }

    const renderButton = () => {
        connectWallet();
        {
            return (
                <div>
                    <input
                        type="text"
                        placeholder="Lock Name"
                        onChange={(e) => setLockName(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={createLock} className={styles.button}>Create Lock</button>
                </div>
            )
        }
    }

    return (
        <div>
            <Head>
                <title>Create a Lock</title>
                <meta name="description" content="Create a Lock" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Create a Lock</h1>
                    <br></br>
                    {renderButton()}
                </div>
            </div>
        </div>
    );
}
