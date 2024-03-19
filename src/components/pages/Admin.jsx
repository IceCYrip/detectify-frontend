import '../../css/Role.css'
import { LinkButton } from '../LinkButton'
import { Box, Button as Btn, Paper } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  return (
    <div className='role-container'>
      <Paper elevation={10} className='role-container-box'>
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <Btn
            variant='contained'
            onClick={() => navigate('/login')}
            endIcon={<LogoutIcon />}
          >
            Logout
          </Btn>
        </Box>

        <h2>Welcome:</h2>
        <h1>ADMIN</h1>
        <LinkButton
          to='/add-account'
          className='btns'
          buttonStyle='btn--long'
          buttonSize='btn--large'
        >
          Add Account
        </LinkButton>
        <LinkButton
          to='/manage-account'
          className='btns'
          buttonStyle='btn--long'
          buttonSize='btn--large'
        >
          Manage Accounts
        </LinkButton>
      </Paper>
    </div>
  )
}

export default Admin
