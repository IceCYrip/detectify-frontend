import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import bgImg from '../../img/bg.png'
import QrScanner from '../QrScanner'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import abi from '../../utils/Identeefi.json'
import { ethers } from 'ethers'

const ScannerPage = () => {
  const [qrData, setQrData] = useState('')

  const { auth } = useAuth()
  const navigate = useNavigate()

  const getEthereumObject = () => window.ethereum

  const ethereum = getEthereumObject()

  const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd'
  const CONTRACT_ABI = abi.abi
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const productContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  )

  const passData = async (data) => {
    const scannedData = !!data ? JSON.parse(data) : ''

    console.log('scannedData?.serialNumber: ', scannedData?.serialNumber)

    if (scannedData?.serialNumber) {
      axios
        .post('http://localhost:3003/product/verify', {
          serialNumber: scannedData?.serialNumber,
        })
        .then(async (res) => {
          if (res.data) {
            const product = await productContract.getProduct(
              scannedData?.serialNumber
            )

            if (product?.length > 0) {
              if (auth?.role == 'supplier' || auth?.role == 'retailer') {
                navigate('/update-product', { state: { scannedData } })
              } else {
                navigate('/authentic-product', { state: { scannedData } })
              }
            } else {
              navigate('/fake-product')
            }
          }
        })

      const product = await productContract.getProduct(
        scannedData?.serialNumber
      )
      console.log('ProductDetailsfromContract: ', product)
      if (product?.length > 0) {
        if (auth?.role == 'supplier' || auth?.role == 'retailer') {
          navigate('/update-product', { state: { scannedData } })
        } else {
          navigate('/authentic-product', { state: { scannedData } })
        }
      } else {
        navigate('/fake-product')
      }
    } else {
      navigate('/fake-product')
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Box
      sx={{
        // backgroundImage: `url(${bgImg})`,
        backgroundColor: '#e3eefc',
        minHeight: '80vh',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: -2,
        overflowY: 'scroll',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '400px',
          margin: 'auto',
          marginTop: '10%',
          marginBottom: '10%',
          padding: '3%',
          // backgroundColor: '#e3eefc',
          backgroundColor: 'white',
          borderRadius: 8,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '5%',
          }}
        >
          <Typography
            variant='h2'
            sx={{
              textAlign: 'center',
              marginBottom: '3%',
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
              variant='contained'
              sx={{
                marginTop: '5%',
              }}
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
