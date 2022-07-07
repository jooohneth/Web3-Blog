import { useState } from 'react'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context.js'
import { ownerAddress } from '../config'
import 'easymde/dist/easymde.min.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  const [account, setAccount] = useState(null);

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { 
            infuraId: "42e4bb6840fd45ac87a53be66b381b93"
          },
        },
      },
    })
    return web3Modal
  }

  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <div>
      <nav className={nav}>
        <div className={header}>
          <Link href="/">
            <a>
              <img src="/logo.svg" alt="React Logo" style={{width: "50px"}}/>
            </a>
          </Link>
          <Link href="/">
              <div className={titleContainer}>
                <h2 className={title}>Full Stack</h2>
                <p className={description}>WEB3</p>
              </div>
          </Link>
          {!account && (
            <div className={buttonContainer}>
              <button className={buttonStyle} onClick={connect}>Connect</button>
            </div>
          )}
          {account && 
            <p className={accountInfo}>{account}</p>
          }
        </div>
        <div className={linkContainer}>
          <Link href="/">
            <a className={link}>
              Home
            </a>
          </Link>
          {(account == ownerAddress) && (
            <Link href="/create-post">
              <a className={link}>
                Create Post
              </a>
            </Link>
          )}
        </div>
      </nav>
      <div className={container}>
            <AccountContext.Provider value={account}>
              <Component {...pageProps} connect={connect} />
            </AccountContext.Provider>
       </div>
    </div>
  )

}

export default MyApp
