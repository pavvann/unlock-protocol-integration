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
        80001: {
            unlockAddress: '0x1FF7e338d5E582138C46044dc238543Ce555C963',
            provider: 'https://rpc.unlock-protocol.com/80001',
            chainId: '0x13881',
        },
    };

    const [lockName, setLockName] = useState("")
    const [walletConnected, setWalletConnected] = useState(false);
    const createLock = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // if (provider.getNetwork() != 5) {
        //     window.alert("Change network to Goerli");
        // }

        // create unlock-protocol lock
        const walletService = new WalletService(networks);

        // @dev add key here 
        const wallet = new ethers.Wallet("add key here", provider)
        await walletService.connect(provider, wallet);
        // Connect to a provider with a wallet
        // await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const lock = await walletService.createLock(
            {
                maxNumberOfKeys: 100,
                name: lockName,
                // creator: address,
                expirationDuration: 864000,
                // @dev remove currencyContractAddress for ETH payments
                // @param this contract address is USDC Polygon Mumbai Testnet
                currencyContractAddress: "0xE097d6B3100777DC31B34dC2c58fB524C2e76921",
                keyPrice: "1", // Key price needs to be a string
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(lock)
        
    }
    const setreferrer = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // if (provider.getNetwork() != 5) {
        //     window.alert("Change network to Goerli");
        // }
        // create unlock-protocol lock
        const walletService = new WalletService(networks);
        const signer = provider.getSigner();
        await walletService.connect(provider, signer);
        // Connect to a provider with a wallet
        // await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const fee = await walletService.setReferrerFee(
            {
                lockAddress: "0x16CC1193c1E128558a02C4533901B1c0eEf7B021",
                address: "0xaA4D74cacC47aCAD1a9fd5FD6eD1f81A2E57fA17",
                feeBasisPoint: 5000,
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(fee);
    }
    const connectWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
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
                    <button onClick={setreferrer} className={styles.button}>Set Fee</button>

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
