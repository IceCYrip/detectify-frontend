import '../../css/Role.css'
import { Button } from '../Button'
import { Link } from 'react-router-dom'
import { Box, Button as Btn, Paper } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

const Supplier = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const navigate = useNavigate()
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
        <h1>Supplier</h1>

        <Link to='/profile'>
          <Button
            className='btns'
            buttonStyle='btn--long'
            buttonSize='btn--large'
          >
            Check Profile
          </Button>
        </Link>

        <Link to='/scanner'>
          <Button
            className='btns'
            buttonStyle='btn--long'
            buttonSize='btn--large'
          >
            Update Product
          </Button>
        </Link>

        {!currentAccount && (
          <Button
            className='btns'
            buttonStyle='btn--long'
            buttonSize='btn--large'
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </Paper>
    </div>
  )
}

export default Supplier
