import React, { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa';
import Button from '../components/Button';
import { FaTrash } from 'react-icons/fa'
import { IoSend } from "react-icons/io5";

function ReviewCard({ name, date, rating, comment, }) {
    const [textboxValue, settextboxValue] = useState("")
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < rating) {
          stars.push(<FaStar key={i} />);
        } else {
          stars.push(<FaRegStar key={i} />);
        }
      }

    return (
        

            <div className="flex flex-col rounded-2xl bg-[#005B8E] mt-2 text-white group">
                <div className="flex flex-row pb-0 p-4 justify-between">
                    <h2 className='text-2xl'>{name}</h2>
                    <div className="flex flex-row mr-2">
                        {stars}
                    </div>
                </div>
                <p className='pt-1 pl-4 text-xs'>Last modified on {date.split("T")[0]}</p>
                <div className="p-4">
                    <p>{comment}</p>
                </div>
                {/* <div className={`group-hover:flex flex-row p-4 pt-2 hidden`}> */}
                <div className={`group-hover:flex flex-row p-4 pt-2 ${textboxValue?"flex":"hidden"}`}>
                    <input className='rounded-2xl pl-2 p-1 flex-1 text-black' onChange={v => settextboxValue(v.target.value)} type='text' placeholder='Quick Reply...' />
                    <Button icon={<IoSend />} text={"Save"} className={"bg-green-500"} />
                    <Button icon={<FaTrash />} text={"Delete"} className={"bg-red-500"} />
                </div>
            </div>
        
    )
}

export default ReviewCard