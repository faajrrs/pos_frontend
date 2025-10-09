import React, { Component } from 'react'
import { Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class sukses extends Component {
  render() {
    return (
      <div className='mt-4 flex flex-col items-center justify-center'>
      <Image src="assets/images/success.png" width={200}/>
        <h2>Sukses Pesanan</h2>
        <p>Terima kasih sudah memesan</p>
        <Button variant='primary' as={Link} to={'/'}>
            Kembali
        </Button>
      </div>
    )
  }
}
