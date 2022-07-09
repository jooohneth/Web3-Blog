import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { contractAddress } from '../config'
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

const client = create('https://ipfs.infura.io:5001/api/v0')
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)
const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const fileRef = useRef(null)
  const { title, content } = post
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 500)
  }, [])
}

function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  async function createNewPost() {   
    if (!title || !content) return
    const hash = await savePostToIpfs()
    await savePost(hash)
    router.push(`/`)
  }

  async function savePostToIpfs() {
    try {
      const added = await client.add(JSON.stringify(post))
      return added.path
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function savePost(hash) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
      console.log('contract: ', contract)
      try {
        const val = await contract.createPost(post.title, hash)
        console.log('val: ', val)
      } catch (err) {
        console.log('Error: ', err)
      }
    }    
  }

  function triggerOnChange() {
    fileRef.current.click()
  }

  async function handleFileChange (e) {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return
    const added = await client.add(uploadedFile)
    setPost(state => ({ ...state, coverImage: added.path }))
    setImage(uploadedFile)
  }

export default CreatePost