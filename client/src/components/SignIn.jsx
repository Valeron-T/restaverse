import React from 'react'
import { authenticate, logout } from '../services/API';
import SignOutModal from './SignOutModal';


function SignIn({ isExpanded }) {

    return (
        <div className={`border-t flex p-3 transition-all cursor-pointer ${isExpanded ? "bg-blue-100 dark:bg-[#095f87] dark:text-white" : "max-sm:hidden"} `}>
            <SignOutModal logout={logout} authenticate={authenticate}/>

            <div
                className={`
              flex justify-between items-center
              overflow-hidden transition-all ${isExpanded ? "w-52 ml-3" : "w-0"}
          `}
            >
                <div className="leading-4">
                    <h4 className="font-semibold">{localStorage.getItem('user') ? localStorage.getItem('user') : "Sign In"}</h4>
                    <span className="dark:text-white text-xs text-gray-600">{localStorage.getItem('email') ? localStorage.getItem('email') : ""}</span>
                </div>
            </div>
        </div>
    )
}

export default SignIn