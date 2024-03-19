import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import bgImg from '../../img/bg.png'
import { useNavigate } from 'react-router-dom'

const FakeProduct = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-2)
  }

  return (
    <Box
      sx={{
        // backgroundImage: `url(${bgImg})`,
        backgroundColor: '#e3eefc',
        minHeight: '80vh',
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
        elevation={3}
        sx={{
          width: '400px',
          margin: 'auto',
          marginTop: '10%',
          marginBottom: '10%',
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
          Product Authentication Failed
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
          We're sorry to inform you that the product you scanned is not
          authentic. It appears to be a counterfeit.
        </Typography>

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
      </Paper>
    </Box>
  )
}

export default FakeProduct
