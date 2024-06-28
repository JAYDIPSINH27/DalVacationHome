import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import { AuthenticationContext } from '../AuthenticationContextProvider'

const ClientDashboard = () => {
  const auth = useContext(AuthenticationContext);
  console.log(auth);
  return (
    <div>
      <Navbar />
      <h1 className='text-3xl'>Welcome customer!</h1>
      </div>
  )
}

export default ClientDashboard