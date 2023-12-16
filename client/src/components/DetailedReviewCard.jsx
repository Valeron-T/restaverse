import React, { useState } from 'react'
import { FaRegStar, FaReply, FaStar } from 'react-icons/fa';
import Button from '../components/Button';
import { FaTrash } from 'react-icons/fa'
import { IoReload, IoSend } from "react-icons/io5";
import { deleteReview, replyToReview } from '../services/API';
import ReplyModal from './ReplyModal';

function DetailedReviewCard({ name, modifiedDate, rating, comment, rid, createdDate, currentReply, currentReplyDate }) {
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<FaStar key={i} />);
        } else {
            stars.push(<FaRegStar key={i} />);
        }
    }

    return (
        <div className={`flex flex-col ${rating > 3 ? "bg-green-800" : rating < 3 ? "bg-red-800" : "bg-[#005B8E]"}  rounded-2xl mt-2`}>
            <div className="flex sm:flex-row flex-col text-white">
                <div className="flex flex-row p-4 justify-start items-start sm:w-[30%]">
                    {/* Can optionally use Google profile Image */}
                    <img className='w-16 h-16 mr-2 p-2 rounded-full' src={`https://ui-avatars.com/api/?name=${name}`} />
                    <div className="flex flex-col">
                        <h2 className='text-2xl mb-2'>{name}</h2>
                        <p className='text-xs'>Modified on {modifiedDate.split("T")[0]} at {modifiedDate.split("T")[1]}</p>
                        <p className='text-xs pt-1'>Created on {createdDate.split("T")[0]} at {createdDate.split("T")[1]}</p>
                        {currentReplyDate && <p className='text-xs pt-1'>Replied on {currentReplyDate.split("T")[0]} at {currentReplyDate.split("T")[1]}</p>}
                    </div>
                </div>
                <div className="flex flex-col p-4 justify-between sm:w-[65%]">

                    <div className="flex flex-row mr-2">
                        {stars}
                    </div>
                    <div className="flex flex-col py-2">
                        <p className='text-lg'>{comment}</p>
                        {currentReply && <p className='text-lg p-2 mt-2 sm:ml-1 flex-1 rounded-2xl bg-[#ffffff5b]'>Your Reply : {currentReply}</p>}
                    </div>
                </div>

            </div>

            <div className={`flex items-center justify-center flex-1 bg-[#ffffff20] flex-row p-4 pt-2`}>
                <FaReply fill='white' />
                <ReplyModal replyId={rid} currentReply={currentReply} />
                
            </div>
        </div>

    )
}

export default DetailedReviewCard