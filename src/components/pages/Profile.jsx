import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import bgImg from '../../img/bg.png'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [name, setName] = useState([])
  const [description, setDescription] = useState([])
  const [role, setRole] = useState([])
  const [website, setWebsite] = useState([])
  const [location, setLocation] = useState([])
  const [image, setImage] = useState({
    file: [],
    filepreview: null,
  })

  const { auth } = useAuth()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleData = async (e) => {
    const res = await axios
      .get(`http://localhost:3003/profile/${auth.user}`)
      .then((res) => {
        setName(res?.data[0].name)
        setDescription(res?.data[0].description)
        setRole(res.data[0].role)
        setWebsite(res?.data[0].website)
        setLocation(res?.data[0].location)
        setImage(res?.data[0].image)
      })
  }

  useEffect(() => {
    handleData()
  }, [])

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
          padding: '3%',
          // backgroundColor: '#e3eefc',
          backgroundColor: 'white',
        }}
      >
        {image ? (
          <center>
            <img
              src={image}
              alt='image'
              width={120}
              style={{
                border: '1px solid #1565c0',
                borderRadius: '50%',
                boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
              }}
            />
          </center>
        ) : (
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: 'auto',
              marginBottom: '3%',
              backgroundColor: '#3f51b5',
            }}
          >
            {name[0]}
          </Avatar>
        )}

        <Typography
          variant='h4'
          sx={{
            textAlign: 'center',
            marginBottom: '5%',
          }}
        >
          {name}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            textAlign: 'center',
            marginBottom: '3%',
          }}
        >
          Description: {description}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            textAlign: 'center',
            marginBottom: '3%',
          }}
        >
          Role: {role}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            textAlign: 'center',
            marginBottom: '3%',
          }}
        >
          Website: {website}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            textAlign: 'center',
            marginBottom: '3%',
          }}
        >
          Location: {location}
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant='contained'
            onClick={handleBack}
            sx={{
              marginTop: '7%',
            }}
          >
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default Profile
