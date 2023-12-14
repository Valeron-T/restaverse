import React from 'react'


function Button({ icon, text, className, onClickFunction }) {
    return (
        <div className="">
            <button className="bookmarkBtn ml-2 max-md:hidden" onClick={onClickFunction}>
                <span className={`IconContainer ${className}`}>
                    {icon}
                </span>
                <p className="text">{text}</p>
            </button>

            <button className={`rounded-full p-2 ml-2 md:hidden ${className}`} onClick={onClickFunction}>
                {icon}
            </button>
        </div>
    )
}

export default Button