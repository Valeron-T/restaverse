import React from 'react'
import { getEvents } from '../services/API'
import { useState, useEffect } from "react"

function Account() {
    const [acce, setacce] = useState({})

    useEffect(() => {
        var events = getEvents()
        setacce(events)
        
    }, [])


    return (
        <div><h1>Account</h1><p>{acce[0]}</p></div>
        
    )
}

export default Account