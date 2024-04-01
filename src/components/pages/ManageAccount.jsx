import { Box, Paper, Typography } from '@mui/material'
import bgImg from '../../img/bg.png'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const columns = [
  {
    headerClassName: 'cellColor',
    field: 'name',
    headerName: 'Name',
    width: 120,
  },
  {
    headerClassName: 'cellColor',
    field: 'description',
    headerName: 'Description',
    minWidth: 300,
    flex: 1,
  },
  {
    headerClassName: 'cellColor',
    field: 'username',
    headerName: 'Username',
    width: 130,
  },
  {
    headerClassName: 'cellColor',
    field: 'website',
    headerName: 'Website',
    width: 200,
  },
  {
    headerClassName: 'cellColor',
    field: 'location',
    headerName: 'Location',
    width: 200,
  },
  {
    headerClassName: 'cellColor',
    field: 'role',
    headerName: 'Role',
    width: 130,
  },
  // { field: 'image', headerName: 'Image', width: 130 },
]

const ManageAccount = () => {
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    handleData()
  }, [])

  const handleData = async (e) => {
    const res = await axios
      .get('http://localhost:3003/profileAll')
      .then((res) => {
        setRows(res.data)
      })
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Box
      sx={{
        // backgroundImage: `url(${bgImg})`,
        backgroundColor: '#e3eefc',
        height: '92vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '80%',
          // margin: "auto",
          // height: "530px",
          // marginTop: "5%",
          // marginBottom: "5%",
          padding: '20px 40px',
          // backgroundColor: '#e3eefc',
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
            marginBottom: 2,
          }}
        >
          Manage Account
        </Typography>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            sx={{
              '& .cellColor': {
                backgroundColor: '#1976d2',
                color: 'white',
              },
            }}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Paper>
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
              marginTop: 2,
            }}
          >
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ManageAccount
