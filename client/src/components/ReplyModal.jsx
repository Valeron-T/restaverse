import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Button from './Button';
import { deleteReview, replyToReview } from '../services/API';
import { IoReload, IoSend } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';

function ReplyModal({ currentReply, replyId }) {
    const [textboxValue, settextboxValue] = useState("")

    return (
        <Popup className='bg-black' trigger={<p className='rounded-2xl outline-none cursor-pointer bg-transparent text-white text-center p-2 self-center' >{currentReply ? "Modify Reply" : "Reply"} </p>} modal>
            <div className="flex flex-col sm:p-4 p-2">
                <label className='text-center'>Your reply</label>
                <input className='rounded-2xl outline-none placeholder:text-white mt-2 bg-[#ffffff52] pl-4 p-1 flex-1'  onChange={v => settextboxValue(v.target.value)} type='text' value={textboxValue} placeholder='Type Something...'></input>
                <div className="flex flex-row pt-4 justify-evenly">
                    <Button icon={<IoSend />} text={"Post"} className={"bg-green-500"} onClickFunction={() => { replyToReview(replyId, textboxValue) }} />
                    { currentReply && <Button icon={<FaTrash />} text={"Delete"} className={"bg-red-500"} onClickFunction={() => { deleteReview(replyId) }} /> }
                    <Button icon={<IoReload />} text={"Clear"} className={"bg-blue-500"} onClickFunction={() => { settextboxValue("") }} />
                </div>
            </div>

        </Popup>
    )
}

export default ReplyModal