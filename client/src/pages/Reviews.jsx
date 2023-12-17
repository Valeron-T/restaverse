import React, { useEffect, useState } from 'react'
import ReviewList from '../components/ReviewList';
import { getLocations } from '../services/API';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function Reviews({ isLoggedin }) {
  const [locations, setLocations] = useState([])
  const [selectedlocation, setSelectedLocation] = useState({
    label: 'All (Default)',
    value: 'all'
  })

  useEffect(() => {
    getLocations().then(val => {

      const defaultChoice = [{
        label: 'All (Default)',
        value: 'all'
      }];

      const modifiedLocations = val.locations.map((item) => ({
        label: item.locationName,
        value: item.name
      }));

      const combinedLocations = defaultChoice.concat(modifiedLocations);

      setLocations(combinedLocations);
      console.log(locations)
    })


  }, [])

  return (
    <div className='flex flex-1 flex-col font-poppins'>

      {/* Display message to log in if not logged in */}
      {!isLoggedin ? <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl bg-white">
        <h1 className='md:text-5xl sm:text-4xl text-3xl'>Please log in to access this page</h1>
      </div> : null}

      {/* Render reviews if logged in */}
      {isLoggedin && <div className="flex flex-col m-4 sm:p-6 p-4 rounded-2xl bg-white">
        <h1 className='md:text-4xl sm:text-3xl text-2xl pb-2'>Reviews</h1>
        <div className="flex sm:flex-row flex-col">
          <p className='self-center'>Location: </p>
          <Dropdown className='p-2' options={locations} onChange={v => setSelectedLocation(v)} value={selectedlocation} placeholder="Select an option" />
        </div>

        <ReviewList isDetailed={true} selectedlocation={selectedlocation?.value} />
      </div>}

    </div>
  )
}

export default Reviews