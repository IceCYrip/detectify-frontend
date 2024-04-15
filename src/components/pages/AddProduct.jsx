import { Box, Paper, Typography } from '@mui/material'
import bgImg from '../../img/bg.png'
import { TextField, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import abi from '../../utils/Identeefi.json'
import QRCode from 'qrcode.react'
import dayjs from 'dayjs'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Geocode from 'react-geocode'

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
      alert('Make sure you have Metamask!')
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

const AddProduct = () => {
  const [buttonState, setButtonState] = useState(false)
  const [qrCodeGenerated, setQRrCodeGenerated] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState({
    file: [],
    filepreview: null,
  })
  const [qrData, setQrData] = useState('')
  const [manuDate, setManuDate] = useState('')
  const [manuLatitude, setManuLatitude] = useState('')
  const [manuLongtitude, setManuLongtitude] = useState('')
  const [manuName, setManuName] = useState('')
  const [loading, setLoading] = useState('')
  const [manuLocation, setManuLocation] = useState('')
  // const [isUnique, setIsUnique] = useState(true)

  const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd'
  const contractABI = abi.abi

  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account)
      }
    })
    getUsername()
    getCurrentTimeLocation()
  }, [])

  useEffect(() => {
    //set next serial number
    axios
      .get('http://localhost:3003/product/serialNumber')
      .then((res) => setSerialNumber(res?.data?.serialnumber + 1))
      .catch((err) => console.log(err))
  }, [])

  const generateQRCode = async (serialNumber) => {
    // const qrCode = await productContract.getProduct(serialNumber);
    const data = CONTRACT_ADDRESS + ',' + serialNumber
    setQrData(data)
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeGenerated
    link.download = `${serialNumber}.png` // Set the desired file name with extension
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleImage = async (e) => {
    setImage({
      ...image,
      file: e.target.files[0],
      filepreview: URL.createObjectURL(e.target.files[0]),
    })
  }

  const getUsername = async (e) => {
    const res = await axios
      .get(`http://localhost:3003/profile/${auth.user}`)
      .then((res) => {
        setManuName(res?.data[0].name)
        setManuLocation(res?.data[0].location)
      })
  }

  // to upload image
  const uploadImage = async (image) => {
    const data = new FormData()
    data.append('image', image.file)

    axios
      .post('http://localhost:3003/upload/product', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        console.log(res)

        if (res.data.success === 1) {
          console.log('image uploaded')
        }
      })
      .catch((err) => console.log(err))
  }

  const registerProduct = async () => {
    setButtonState(true)
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const productContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        )

        // write transactions
        const registerTxn = await productContract.registerProduct(
          name,
          brand,
          serialNumber,
          description.replace(/,/g, ';'),
          image.file.name,
          manuName,
          manuLocation,
          manuDate.toString()
        )
        console.log('Mining (Product Registering) ...', registerTxn.hash)
        setLoading('Mining (Product Registering) ...', registerTxn.hash)

        await registerTxn.wait()
        console.log('Mined (Product Registered) --', registerTxn.hash)
        setLoading('Mined (Product Registered) --', registerTxn.hash)
        addProductDB() // add product to database

        generateQRCode(serialNumber)

        const product = await productContract.getProduct(serialNumber)

        console.log('Retrieved product...', product)
        setLoading('')

        // navigate('/manufacturer')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentTimeLocation = () => {
    setManuDate(dayjs().unix())
    navigator.geolocation.getCurrentPosition(function (position) {
      setManuLatitude(position.coords.latitude)
      setManuLongtitude(position.coords.longitude)
    })
  }

  const addProductDB = async () => {
    uploadImage(image)

    try {
      const profileData = JSON.stringify({
        serialNumber: serialNumber,
        name: name,
        brand: brand,
      })

      axios
        .post('http://localhost:3003/addproduct', profileData, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          setQRrCodeGenerated(res.data.qr)
        })
        .catch((err) => {
          console.log('error: ', err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  // const checkUnique = async () => {
  //   const res = await axios.get('http://localhost:3003/product/serialNumber')

  //   const existingSerialNumbers = res.data?.serialnumber
  //   existingSerialNumbers.push(serialNumber)

  //   // checking for duplicated serial number
  //   const duplicates = existingSerialNumbers.filter(
  //     (item, index) => existingSerialNumbers.indexOf(item) != index
  //   )

  //   const isDuplicate = duplicates.length >= 1

  //   setIsUnique(!isDuplicate)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // checkUnique()

    // if (isUnique) {
    //   // uploadImage(image)
    //   // addProductDB(e) // add product to database
    //   setLoading(
    //     'Please pay the transaction fee to update the product details...'
    //   )
    //   await registerProduct(e)
    // }
    setLoading(
      'Please pay the transaction fee to update the product details...'
    )
    await registerProduct(e)

    // setIsUnique(true)
  }

  return (
    <Box
      sx={{
        backgroundColor: '#e3eefc',
        minHeight: '90vh',
        padding: '13px',

        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'white',
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
          Add Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            disabled
            // error={!isUnique}
            // helperText={!isUnique ? 'Serial Number already exists' : ''}
            id='outlined-basic'
            margin='normal'
            label='Serial Number'
            variant='outlined'
            inherit='False'
            onChange={(e) => setSerialNumber(e.target.value)}
            value={serialNumber}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Name'
            variant='outlined'
            inherit='False'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Brand'
            variant='outlined'
            inherit='False'
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Description'
            variant='outlined'
            inherit='False'
            multiline
            minRows={2}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          <Button
            variant='outlined'
            component='label'
            fullWidth
            sx={{ marginTop: '3%', marginBottom: '3%' }}
          >
            Upload Image
            <input type='file' hidden onChange={handleImage} />
          </Button>

          {image.filepreview !== null ? (
            <img
              src={image.filepreview}
              alt='preview'
              style={{ width: '100%', height: '100%' }}
            />
          ) : null}

          {/* {qrData !== "" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "3%",
              }}
            >
              karan
              <QRCode value={qrData} id="QRCode" />
            </div>
          ) : null} */}
          {!!qrCodeGenerated && <img src={qrCodeGenerated} alt='qrCode' />}

          {/* {qrData !== "" ? (
            
            </div>
          ) : null} */}

          {!!qrCodeGenerated && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3%',
              }}
            >
              <Button
                variant='outlined'
                component='label'
                fullWidth
                sx={{ marginTop: '3%', marginBottom: '3%' }}
                onClick={downloadQR}
              >
                Download
              </Button>
            </div>
          )}

          {loading === '' ? null : (
            <Typography
              variant='body2'
              sx={{
                textAlign: 'center',
                marginTop: '3%',
              }}
            >
              {loading}
            </Typography>
          )}

          <Button
            disabled={buttonState}
            variant='contained'
            type='submit'
            sx={{
              width: '100%',
              marginTop: '3%',
            }}
          >
            Add Product
          </Button>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={handleBack}
              sx={{
                marginTop: '5%',
              }}
            >
              Back
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default AddProduct
