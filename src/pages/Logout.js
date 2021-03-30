import React from "react"
import { Link } from "react-router-dom"

const Logout = () => (
    <div id = "Logout">
    <h1>
        Hi, This is our current logout page :)
    </h1>

    <button onClick={(e) => (window.location = "http://localhost:5000/api/logout" )}>
        Log out here! 
    </button>
    
    </div>
)

export default Logout