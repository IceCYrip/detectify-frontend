import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

const QrScanner = (props) => {
  const [data, setData] = useState('')

  useEffect(() => {
    props.passData(data)
  }, [data])

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result?.text) {
            props.passData(result?.text)
          }
        }}
        onError={(err) => console.log('err: ', err)}
        style={{ width: '100%' }}
      />
    </>
  )
}

export default QrScanner
