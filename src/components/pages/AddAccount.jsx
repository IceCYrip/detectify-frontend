import '../../css/Role.css'
import {
  TextField,
  Box,
  Paper,
  Typography,
  Autocomplete,
  Button,
} from '@mui/material'
import React from 'react'
import { useRef, useState, useEffect } from 'react'
import bgImg from '../../img/bg.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import compressFile from '../../utils/imageCompression'

const options = ['manufacturer', 'supplier', 'retailer']

const AddAccount = () => {
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [role, setRole] = React.useState(options[0])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [image, setImage] = useState({
    file: [],
    filepreview: null,
  })

  const errRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  // const handleImage = async (e) => {
  //   const file = await compressFile(e.target.files[0])
  //   const reader = new FileReader()

  //   reader.onloadend = () => {
  //     // setBase64Image(reader.result);
  //     setImage({
  //       ...image,
  //       file: e.target.files[0],
  //       // filepreview: URL.createObjectURL(e.target.files[0]),
  //       filepreview: reader.result,
  //     })
  //   }

  //   if (file) {
  //     reader.readAsDataURL(file)
  //   }
  // }

  const handleCrop = (imageURL) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      const minDimension = Math.min(img.width, img.height)

      // Calculate the cropping coordinates to center the image
      const cropX = (img.width - minDimension) / 2
      const cropY = (img.height - minDimension) / 2

      // Set canvas size to the desired cropped size
      canvas.width = minDimension
      canvas.height = minDimension

      // Draw the cropped image on the canvas
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minDimension,
        minDimension,
        0,
        0,
        minDimension,
        minDimension
      )

      // Convert the canvas content to a data URL
      const croppedImageBase64 = canvas.toDataURL('image/jpeg') // You can use other formats like 'image/png' if needed

      // imageSetter(croppedImageBase64)
      setImage({
        ...image,
        // file: file,
        // filepreview: URL.createObjectURL(e.target.files[0]),
        filepreview: croppedImageBase64,
      })
    }

    // img.src = image
    img.src = imageURL
  }

  const handleImage = async (event) => {
    const file = event.target.files[0]

    const compressedImage = await compressFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        // setImage(reader.result)
        handleCrop(reader.result)
      }
      reader.readAsDataURL(compressedImage)
    }
  }

  // to upload image
  const uploadImage = async (image) => {
    const data = new FormData()
    data.append('image', image.file)

    axios
      .post('http://localhost:3003/upload/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.data.success === 1) {
          console.log('image uploaded')
        }
      })
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const accountData = JSON.stringify({
        username: user,
        password: pwd,
        role: role,
      })

      const profileData = JSON.stringify({
        username: user,
        name: name,
        description: description,
        website: website,
        location: location,
        // image: image.file.name,
        image: image.filepreview,
        role: role,
      })

      const res = await axios.post(
        'http://localhost:3003/addaccount',
        accountData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const res2 = await axios.post(
        'http://localhost:3003/addprofile',
        profileData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      uploadImage(image)

      setUser('')
      setPwd('')
      setPwd2('')
      setRole(options[0])
      setName('')
      setDescription('')
      setWebsite('')
      setLocation('')
      setImage({
        file: [],
        filepreview: null,
      })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Server is down. Please try again later.')
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid username or password.')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized access.')
      } else {
        setErrMsg('Login Failed. Please try again later.')
      }
      errRef.current.focus()
    }
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
          // backgroundColor: '#e3eefc',
          backgroundColor: 'white',
        }}
      >
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live='assertive'
        >
          {errMsg}
        </p>

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
          Add Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Username'
            variant='outlined'
            inherit='False'
            onChange={(e) => setUser(e.target.value)}
            value={user}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Password'
            type='password'
            variant='outlined'
            inherit='False'
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Confirm Password'
            type='password'
            variant='outlined'
            inherit='False'
            onChange={(e) => setPwd2(e.target.value)}
            value={pwd2}
          />

          {pwd == pwd2 ? null : (
            <Typography
              variant='body2'
              sx={{
                textAlign: 'center',
                fontSize: '12px',
                color: 'red',
              }}
            >
              Passwords do not match
            </Typography>
          )}

          <Autocomplete
            disablePortal
            id='combo-box-demo'
            options={options}
            fullWidth
            value={role}
            onChange={(event, newRole) => {
              setRole(newRole)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                id='outlined-basic'
                margin='normal'
                label='Role'
                variant='outlined'
                inherit='False'
              />
            )}
          />

          <Button
            variant='contained'
            component='label'
            fullWidth
            // onChange = {handleImage}
            sx={{ marginTop: '3%' }}
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
            label='Description'
            variant='outlined'
            inherit='False'
            multiline
            minRows={2}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Website'
            variant='outlined'
            inherit='False'
            onChange={(e) => setWebsite(e.target.value)}
            value={website}
          />

          <TextField
            fullWidth
            id='outlined-basic'
            margin='normal'
            label='Location'
            variant='outlined'
            inherit='False'
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />

          <Button
            variant='contained'
            type='submit'
            sx={{
              width: '100%',
              marginTop: '3%',
              // backgroundColor: '#98b5d5',
              // '&:hover': { backgroundColor: '#618dbd' },
            }}
          >
            Add Account
          </Button>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant='outlined'
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

export default AddAccount
