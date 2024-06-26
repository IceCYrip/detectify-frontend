import { Box, Paper, Avatar, Typography, Button, Skeleton } from '@mui/material'
import bgImg from '../../img/bg.png'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'
import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'
import abi from '../../utils/Identeefi.json'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { ethers } from 'ethers'
import axios from 'axios'

const getEthereumObject = () => window.ethereum

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
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

const UpdateProduct = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [suppDate, setSuppDate] = useState('')
  const [suppLatitude, setSuppLatitude] = useState('')
  const [suppLongtitude, setSuppLongtitude] = useState('')
  const [suppName, setSuppName] = useState('')
  const [suppLocation, setSuppLocation] = useState('')
  const [loading, setLoading] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [productData, setProductData] = useState('')

  const [name, setName] = useState('P')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [imageName, setImageName] = useState('')
  const [history, setHistory] = useState([])
  const [isSold, setIsSold] = useState(false)

  const [image, setImage] = useState({
    file: [],
    filepreview: null,
  })

  const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd'
  const CONTRACT_ABI = abi.abi

  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const qrData = location.state?.qrData

  const getImage = async (imageName) => {
    setImage((prevState) => ({
      ...prevState,
      filepreview: `http://localhost:3003/file/product/${imageName}`,
    }))
  }

  const handleScan = async (qrData) => {
    const data = qrData.split(',')
    const contractAddress = data[0]
    setSerialNumber(data[1])

    if (contractAddress === CONTRACT_ADDRESS) {
      try {
        const { ethereum } = window

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const productContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          )

          // const product = await productContract.getProduct(data[1].toString())
          const product = await productContract.getProduct(data[1])

          setSaglaData(product)
        } else {
          alert(
            "Ethereum object doesn't exist! Please connect your wallet first!"
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const locationState = location.state.scannedData

  useEffect(() => {
    !!locationState?.serialNumber && getDataFromKuthunTari()
  }, [locationState])

  const getDataFromKuthunTari = async () => {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const productContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      )

      const product = await productContract.getProduct(
        String(locationState?.serialNumber)
      )

      console.log('Retreived Product: ', product)

      setSaglaData(product)
    } else {
      console.log("Ethereum object doesn't exist!")
    }
  }

  const setSaglaData = (data) => {
    let retrievedProduct = data

    setSerialNumber(locationState?.serialNumber)
    setName(retrievedProduct[1])
    setBrand(retrievedProduct[2])
    setDescription(retrievedProduct[3])
    getImage(retrievedProduct[4])

    let history = retrievedProduct[5]?.map((obj) => {
      setIsSold(obj[4])
      return {
        actor: obj[1],
        location: obj[2],
        timestamp: obj[3],
        isSold: obj[4],
      }
    })
    setHistory(history)
  }

  const setData = (d) => {
    const arr = d.split(',')

    setName(arr[1])
    setBrand(arr[2])
    setDescription(arr[3].replace(/;/g, ','))
    // setImageName(arr[4]);
    setImageName('/Heels.webp')
    getImage(arr[4])

    const hist = []
    let start = 5

    for (let i = 5; i < arr.length; i += 5) {
      const actor = arr[start + 1]
      const location = arr[start + 2].replace(/;/g, ',')
      const timestamp = arr[start + 3]
      const isSold = arr[start + 4] === 'true' ? setIsSold(true) : false

      hist.push({
        actor,
        location,
        timestamp,
        isSold,
      })

      start += 5
    }
    setHistory(hist)
  }

  const handleBack = () => {
    // navigate(-1);
    navigate(auth?.role == 'supplier' ? '/supplier' : '/retailer')
  }

  const getHistory = () => {
    return history.map((item, index) => {
      const date = dayjs(item.timestamp * 1000).format('MM/DD/YYYY')
      const time = dayjs(item.timestamp * 1000).format('HH:mm a')

      return (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="textSecondary">
            <b>
              {time} {date}
            </b>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography>
              <b> Location: {item.location} </b>
            </Typography>
            <Typography>
              <b> Actor: {item.actor} </b>
            </Typography>
          </TimelineContent>
        </TimelineItem>
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('locationState: ', location.state)
    navigate('/update-product-details', {
      state: { scannedData: location.state },
    })
  }

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

          margin: '5vh 0vh',

          padding: '3%',
          backgroundColor: 'white',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '5%',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              marginBottom: '3%',
              fontFamily: 'Gambetta',
              fontWeight: 'bold',
              fontSize: '2.5rem',
            }}
          >
            Product Details
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 1,
              width: '100%',
              marginTop: '5%',
              marginBottom: '5%',
            }}
          >
            <Box
              sx={{
                marginRight: '1.5%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: '0 0 35%',
                width: '35%',
              }}
            >
              {!image.filepreview ? (
                <Skeleton variant="circular" width={100} height={100} />
              ) : (
                <Avatar
                  alt={name}
                  src={image.filepreview}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: 'auto',
                    marginBottom: '3%',
                    backgroundColor: '#3f51b5',
                  }}
                >
                  {name}
                </Avatar>
              )}
            </Box>
            <Box
              sx={{
                marginLeft: '1.5%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'left',
                flex: '0 0 65%',
                width: '65%',
              }}
            >
              {/* Product Name */}
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'left',
                  marginBottom: '3%',

                  display: 'flex',
                  columnGap: '5px',
                  alignItems: 'center',
                }}
              >
                {!serialNumber ? (
                  <Skeleton variant="rectangular" width={125} height={20} />
                ) : (
                  <span>Name: {name}</span>
                )}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  textAlign: 'left',
                  marginBottom: '3%',
                  display: 'flex',
                  columnGap: '5px',
                  alignItems: 'center',
                }}
              >
                {!serialNumber ? (
                  <Skeleton variant="rectangular" width={175} height={20} />
                ) : (
                  <span>Serial Number: {serialNumber}</span>
                )}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  textAlign: 'left',
                  marginBottom: '3%',
                }}
              >
                {/* Description: {description} */}
                {!description ? (
                  <Skeleton variant="rectangular" width={250} height={20} />
                ) : (
                  <span>Description: {description}</span>
                )}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  textAlign: 'left',
                  marginBottom: '3%',
                }}
              >
                {!brand ? (
                  <Skeleton variant="rectangular" width={125} height={20} />
                ) : (
                  <span>Brand: {brand}</span>
                )}
              </Typography>
            </Box>
          </Box>

          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
            }}
          >
            {getHistory()}
            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                <b>
                  {dayjs().format('HH:mm a')} {dayjs().format('MM/DD/YYYY')}
                </b>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography>
                  <b>Purchase made: {isSold ? 'Yes' : 'No'}</b>
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>

          {loading === '' ? null : (
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                marginTop: '3%',
              }}
            >
              {loading}
            </Typography>
          )}
          {!isSold && (
            <Button
              variant="contained"
              type="submit"
              sx={{
                width: '50%',
                marginTop: '3%',
              }}
              onClick={handleSubmit}
            >
              Update Product
            </Button>
          )}

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
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

export default UpdateProduct
