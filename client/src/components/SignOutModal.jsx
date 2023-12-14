import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Button from './Button';
import { LuLogIn } from "react-icons/lu";
import { User } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineCancel } from "react-icons/md";


function SignOutModal({ logout, authenticate }) {
    return (
        <div className="">
            {!localStorage.getItem("JWT") ? <button className="p-2 rounded-lg text-slate-200 bg-blue-500 hover:bg-blue-800" onClick={authenticate}><LuLogIn /></button> :
                <Popup className='' trigger={<button className="p-2 rounded-lg text-slate-200 bg-blue-500 hover:bg-blue-800" onClick={logout}>
                    <User />
                </button>} modal>
                    <div className="flex flex-col sm:p-4 p-2">
                        <label className='text-center text-3xl'>Log out ?</label>
                        <div className="flex flex-row pt-4 justify-evenly">
                            <Button icon={<FaCheck />} text={"Yes"} className={"bg-green-500"} onClickFunction={logout} />
                            <Button icon={<MdOutlineCancel />} text={"Cancel"} className={"bg-red-500"} onClickFunction={() => { window.location.reload() }} />
                        </div>
                    </div>

                </Popup>
            }

        </div>

    )
}

export default SignOutModal