import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import { WalletService, Web3Service } from '@unlock-protocol/unlock-js';
import { ethers } from 'ethers';
import Link from 'next/link';


export default function check() {
    const networks = {
        5: {
            unlockAddress: "0x627118a4fB747016911e5cDA82e2E77C531e8206", // Smart contracts docs include all addresses on all networks
            provider: "https://rpc.unlock-protocol.com/5",
        },
    };
    const lockAddress = "enter lock address";
    const [lockManager, setIsLockManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [member, setMember] = useState(false);
    const [balance, setBalance] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState(null)
    const [newName, setNewName] = useState("")
    const [lockName, setLockName] = useState("")
    const [keyRecipient, setKeyRecipient] = useState("")
    const [managerRecipient, setManagerRecipient] = useState("")

    const checkManagerOrMember = async () => {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];

        const signer = provider.getSigner();

        const web3Service = new Web3Service(networks)

        const lock = await web3Service.isLockManager(lockAddress, account, 5);
        console.log("manager = " + lock)
        setIsLockManager(lock);
        let keyStatus = await web3Service.getHasValidKey(lockAddress, account, 5);
        console.log("key = " + keyStatus)
        setMember(keyStatus);
        setLoading(false);
        console.log(account)
    }

    const checkLockName = async () => {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];
        const signer = provider.getSigner();

        // create unlock-protocol lock
        const web3Service = new Web3Service(networks)

        // Connect to a provider with a wallet
        // await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const details = await web3Service.getLock(lockAddress, 5);
        console.log("Lock = " + details)
        setLockName(details.name);
        setLoading(false);
    }

    const checkBalance = async () => {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];
        // if (provider.getNetwork() != 5) {
        //     window.alert("Change network to Goerli");
        // }
        const signer = provider.getSigner();

        // create unlock-protocol lock
        const web3Service = new Web3Service(networks)

        // Connect to a provider with a wallet
        // await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const balance = await web3Service.getAddressBalance(lockAddress, 5);
        console.log("balance = " + balance)
        setBalance(balance);
        setLoading(false);
    }

    const withdraw = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        // if (provider.getNetwork() != 5) {
        //     window.alert("Change network to Goerli");
        // }
        const signer = provider.getSigner();
        // create unlock-protocol lock
        const walletService = new WalletService(networks);

        // Connect to a provider with a wallet
        await walletService.connect(provider, signer);
        // This only resolves when the transaction has been mined, but the callback returns the hash immediately
        const withdraw_ = await walletService.withdrawFromLock(
            {
                lockAddress: lockAddress,
                amount: withdrawAmount,
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(withdraw_)
    }

    const changeLockName = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        const walletService = new WalletService(networks);

        await walletService.connect(provider, signer);
        const changeName = await walletService.updateLockName(
            {
                lockAddress: lockAddress,
                name: newName,
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(changeName)
    }

    const giveKey = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        const walletService = new WalletService(networks);

        await walletService.connect(provider, signer);
        const giveKey_ = await walletService.grantKey(
            {
                lockAddress: lockAddress,
                recipient: keyRecipient,
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(giveKey_)
    }

    const newManager = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        const walletService = new WalletService(networks);

        await walletService.connect(provider, signer);
        const giveKey_ = await walletService.addLockManager(
            {
                lockAddress: lockAddress,
                recipient: managerRecipient,
            },
            {}, // transaction options
            (error, hash) => {
                // This is the hash of the transaction!
                console.log({ hash });
            }
        );
        console.log(giveKey_)
    }

    useEffect(() => {
        if (lockName == "") {
            checkLockName();
        }
        if (!lockManager) {
            checkManagerOrMember();
        }
        if (balance == null) {
            checkBalance();
        }
        
    }, [lockManager, member, balance, lockName]);

    const renderButton = () => {

        if (loading) {
            return (<button className={styles.button}>Loading...</button>);
        }
        if (lockManager) {
            return (
                <div>

                    <div>
                        <h1 className={styles.description}>The Lock Balance is: {balance} ETH</h1>
                        <input
                            type="text"
                            placeholder="Enter Amount to Withdraw"
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={withdraw} className={styles.button1}>Withdraw</button>

                        {console.log(withdrawAmount)}
                        <p>Enter 0 to withdraw full amount</p>
                    </div>
                    <br></br>
                    <hr></hr>
                    <div>
                        <h1 className={styles.description}>Change Lock Name</h1>
                        <input
                            type="text"
                            placeholder="Enter new name"
                            onChange={(e) => setNewName(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={changeLockName} className={styles.button1}>Change Name</button>
                        {console.log(newName)}
                    </div>
                    <br></br>
                    <hr></hr>
                    <div>
                        <h1 className={styles.description}>Grant Key</h1>
                        <input
                            type="text"
                            placeholder="Enter Address"
                            onChange={(e) => setKeyRecipient(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={giveKey} className={styles.button1}>Grant</button>
                        {console.log(keyRecipient)}
                    </div>
                    <br></br>
                    <hr></hr>
                    <div>
                        <h1 className={styles.description}>Add Manager</h1>
                        <input
                            type="text"
                            placeholder="Enter Address"
                            onChange={(e) => setManagerRecipient(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={newManager} className={styles.button1}>Make Manager</button>
                        {console.log(managerRecipient)}
                    </div>
                </div>
            )
        }
        if (member) {
            return (
                <div>
                    <h1>welcome to the experience</h1>
                </div>
            )
        }
        if (!member) {
            return (
                <div>
                    <h1 className={styles.description}>You are not a member. Click below to get your Membership</h1> <br></br>
                    <Link className={styles.button} href="lock checkout url">Become a Member</Link>
                </div>
            )
        }


    }

    return (
        <div>
            <Head>
                <title>Check Locks</title>
                <meta name="description" content="Check Locks" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div>
                <div>
                    <br></br>
                    <h1 className={styles.title}>Lock Name: {lockName}</h1>
                    <br></br>
                </div>
                    
                    {renderButton()}
                </div>
            </div>
        </div>
    );
}