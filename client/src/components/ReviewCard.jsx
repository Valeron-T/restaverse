import React, { useState } from 'react'
import { FaRegStar, FaReply, FaStar } from 'react-icons/fa';
import Button from '../components/Button';
import { FaTrash } from 'react-icons/fa'
import { IoReload, IoSend } from "react-icons/io5";
import { deleteReview, replyToReview } from '../services/API';

function ReviewCard({ name, date, rating, comment, rid }) {
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


        <div className={`flex flex-col rounded-2xl ${rating>3?"bg-green-800":rating<3?"bg-red-800":"bg-[#005B8E]"} mt-4 text-white group`}>
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
            <div className={`group-hover:hidden rounded-b-2xl flex items-center justify-center flex-1 bg-[#ffffff20] flex-row p-4 pt-2 ${textboxValue ? "hidden" : "opacity-100"}`}>
                <FaReply className='' />
                <p className='rounded-2xl outline-none bg-transparent text-white text-center p-2 self-center' >Reply </p>
            </div>

            <div className={`group-hover:flex transition duration-300 max-sm:flex-col flex-row p-4 pt-2 ${textboxValue ? "flex" : "hidden"}`}>

                <input className='rounded-2xl outline-none placeholder:text-white bg-[#ffffff49] pl-4 p-1 flex-1' onChange={v => settextboxValue(v.target.value)} type='text' value={textboxValue} placeholder='Quick Reply...' />
                <div className="flex flex-row max-sm:p-2 max-sm:mt-2 max-sm:self-center">
                    <Button icon={<IoReload />} text={"Clear"} className={"bg-blue-500"} onClickFunction={() => { settextboxValue("") }} />
                    <Button icon={<IoSend />} text={"Post"} className={"bg-green-500"} onClickFunction={() => { replyToReview(rid, textboxValue) }} />
                    <Button icon={<FaTrash />} text={"Delete"} className={"bg-red-500"} onClickFunction={() => { deleteReview(rid) }} />
                </div>

            </div>
        </div>

    )
}

export default ReviewCard