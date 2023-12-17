import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ReviewList from '../components/ReviewList';


function Home({ isLoggedin }) {
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
      navigate("/")
    }

  }, [])


  return (
    <div className='flex flex-1 flex-col font-poppins'>
      <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl dark:bg-[#03212f] dark:text-white bg-white">
        {/* Welcome message */}
        <h1 className='md:text-5xl sm:text-4xl text-3xl'>Hello {isLoggedin ? localStorage.getItem("user").toString().split(" ")[0] : "Guest"} !</h1>
        {isLoggedin && <p className='mt-2'>Here's what changed while you were away</p>}
      </div>
      {/* Display reviews for quick reply if logged in */}
      {isLoggedin && <div className="flex flex-col mt-0 m-4 sm:p-6 p-4 rounded-2xl dark:bg-[#03212f] dark:text-white bg-white">
        <h1 className='md:text-4xl sm:text-3xl text-2xl pb-2'>Latest Reviews</h1>
        <ReviewList onlyDisplayNoReplies={true} selectedlocation={"all"}/>
      </div>}
    </div>
  )
}

export default Home