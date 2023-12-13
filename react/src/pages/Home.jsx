import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()
  var loggedIn = localStorage.getItem("JWT")

  useEffect(() => {
    // Search URL params for jwt token, name and email
    const query = new URLSearchParams(window.location.search);
    const token = query.get('jwt')
    const user = query.get('user')
    const email = query.get('email')

    // If token found, store token and details locally
    if (token) {
      localStorage.setItem('JWT', token);
      localStorage.setItem('user', user);
      localStorage.setItem('email', email);
    }
    navigate("/")


  }, [])


  return (
    <div className='flex flex-1 flex-col'>
      <div className="flex flex-col m-4 sm:p-8 p-4 rounded-2xl bg-white font-poppins">
        <h1 className='md:text-5xl sm:text-4xl text-3xl'>Welcome {loggedIn?localStorage.getItem("user").toString().split(" ")[0]:"Guest"} !</h1>
        {loggedIn&&<p className='mt-2'>Here is what changed while you were away</p>}
      </div>
    </div>
  )
}

export default Home