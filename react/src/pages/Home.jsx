import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()

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
    <div>Home</div>
  )
}

export default Home