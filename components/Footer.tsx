import React from 'react'
import Form from './Form'
import Tilt from './Tilt'

interface Props { }

const Footer = () => {
  return <div>
    <footer className=' text-zinc-800 font-mono text-center p-4 min-h-screen bg-purple-500'>


      <div className=" flex flex-col lg:flex-row items-center justify-center p-2 lg:p-4">
        <Form />


        <Tilt />
      </div>


      <div className='flex justify-between items-center flex-wrap'>
        <p>Under utvikling</p>
        <span>Orgnr: 934582969</span>
        <span>Tlf: +47 929 19 979</span>
        <span>Mail: oinojorgen@gmail.com</span>
        <p>OINO ©  All rights reserved</p>
      </div>
    </footer>
  </div>
}

export default Footer