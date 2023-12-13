import { User } from 'lucide-react';
import React, { useState } from 'react'
import { LuLogIn } from "react-icons/lu";
import { authenticate } from '../services/API';



function SignIn({ isExpanded }) {

    return (
        <div className={`border-t flex p-3 transition-all cursor-pointer ${isExpanded ? "bg-blue-100" : "max-sm:hidden"} `}>
            <div className="p-2 rounded-lg text-slate-200 bg-blue-500 hover:bg-blue-800" onClick={authenticate}>
                {localStorage.getItem('user') ? <User /> : <LuLogIn />}
            </div>
            <div
                className={`
              flex justify-between items-center
              overflow-hidden transition-all ${isExpanded ? "w-52 ml-3" : "w-0"}
          `}
            >
                <div className="leading-4">
                    <h4 className="font-semibold">{localStorage.getItem('user') ? localStorage.getItem('user') : "Sign In"}</h4>
                    <span className="text-xs text-gray-600">{localStorage.getItem('email') ? localStorage.getItem('email') : ""}</span>
                </div>
            </div>
        </div>
    )
}

export default SignIn