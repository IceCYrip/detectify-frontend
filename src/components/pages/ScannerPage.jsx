import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import bgImg from '../../img/bg.png'
import QrScanner from '../QrScanner'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import abi from '../../utils/Identeefi.json'
import { ethers } from 'ethers'

const ScannerPage = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const getEthereumObject = () => window.ethereum

  const ethereum = getEthereumObject()

  const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd'
  const CONTRACT_ABI = abi.abi
  let provider
  try {
    provider = new ethers.providers.Web3Provider(ethereum)
  } catch (error) {
    console.log('providerErr: ', error)
  }
  const signer = provider.getSigner()
  const productContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  )

  const passData = async (data) => {
    const scannedData = !!data ? JSON.parse(data) : ''
    if (scannedData?.serialNumber) {
      axios
        .post('http://localhost:3003/product/verify', {
          serialNumber: scannedData?.serialNumber,
        })
        .then(async (res) => {
          if (res?.data) {
            const isVerified = res?.data?.verified
            console.log('isVerified: ', isVerified)
            if (!isVerified) {
              console.log('isHere')
              navigate('/fake-product')
            } else {
              const product = await productContract.getProduct(
                scannedData?.serialNumber
              )

              // if (product?.length > 0) {
              //   if (auth?.role == 'supplier' || auth?.role == 'retailer') {
              //     navigate('/update-product', { state: { scannedData } })
              //   } else {
              //     navigate('/authentic-product', { state: { scannedData } })
              //   }
              // } else {
              //   navigate('/fake-product')
              // }

              if (auth?.role == 'supplier' || auth?.role == 'retailer') {
                navigate('/update-product', { state: { scannedData } })
              } else {
                navigate('/authentic-product', { state: { scannedData } })
              }

              // if (product?.length > 0) {
              // } else {
              //   navigate('/fake-product')
              // }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })

      // const product = await productContract.getProduct(
      //   scannedData?.serialNumber
      // )
      // if (product?.length > 0) {
      //   if (auth?.role == 'supplier' || auth?.role == 'retailer') {
      //     navigate('/update-product', { state: { scannedData } })
      //   } else {
      //     navigate('/authentic-product', { state: { scannedData } })
      //   }
      // } else {
      //   navigate('/fake-product')
      // }
    } else {
      navigate('/fake-product')
    }
  }

  const handleBack = () => {
    navigate(auth?.role ? -1 : '/')
  }

  return (
    <Box
      sx={{
        backgroundColor: '#e3eefc',
        height: '92vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontFamily: 'Gambetta',
              fontWeight: 'bold',
              fontSize: '2.5rem',
            }}
          >
            Scan QR Code
          </Typography>

          <QrScanner passData={passData} />

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={handleBack}
              variant="contained"
              // sx={{
              //   marginTop: "5%",
              // }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ScannerPage
