import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import bgImg from '../../img/bg.png'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const getEthereumObject = () => window.ethereum

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject()

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error('Make sure you have Metamask!')
      return null
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]

      return account
    } else {
      console.error('No authorized account found')
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

const AuthenticProduct = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const qrData = location.state?.qrData

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account)
      }
    })
  }, [])

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject()
      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = () => {
    connectWallet()
  }

  const locationState = location.state
  useEffect(() => {
    if (currentAccount) {
      navigate('/product', { state: locationState?.scannedData })
    }
  }, [currentAccount])

  return (
    <Box
      sx={{
        minHeight: '92vh',
        backgroundColor: '#e3eefc',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '400px',
          // margin: "auto",
          // marginTop: "10%",
          // marginBottom: "10%",
          padding: '3%',
          // backgroundColor: '#e3eefc',
          backgroundColor: 'white',
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontFamily: 'Montserrat',
            textAlign: 'center',
            marginBottom: '5%',
            marginTop: '5%',
          }}
        >
          Congrats!
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontFamily: 'Montserrat',
            textAlign: 'center',
            marginBottom: '5%',
            marginTop: '5%',
          }}
        >
          Your Product is Authentic
        </Typography>
        <Typography
          variant='body2'
          sx={{
            textAlign: 'center',
            marginTop: '10%',
            marginBottom: '5%',
          }}
        >
          Connect Your Wallet to View Product Details
        </Typography>

        <Button
          variant='contained'
          sx={{ width: '100%', marginTop: '5%' }}
          onClick={handleClick}
        >
          Connect Wallet
        </Button>
      </Paper>
    </Box>
  )
}

export default AuthenticProduct
