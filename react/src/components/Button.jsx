import React from 'react'


function Button({ icon, text, className }) {
    return (
        <div className="">
            <button className="bookmarkBtn ml-2 max-sm:hidden">
                <span className={`IconContainer ${className}`}>
                    {icon}
                </span>
                <p className="text">{text}</p>
            </button>

            <button className={`rounded-full p-2 ml-2 sm:hidden ${className}`}>
                {icon}
            </button>
        </div>
    )
}

export default Button