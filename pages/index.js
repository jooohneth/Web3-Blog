import { css } from '@emotion/css';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Link from 'next/link';
import { AccountContext } from '../context';
import { contractAddress, ownerAddress } from '../config';
import Blog from "../artifacts/contracts/Blog.sol/Blog.json";

export default function Home(props){
  const {posts} = props;
  const account = useContext(AccountContext);
  const router = useRouter();

  async function navigate(){
    router.push("/create-post");
  }
} 