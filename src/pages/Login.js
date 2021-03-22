import React, { useState,useEffect } from "react"
import { Link } from "react-router-dom"

function Login(){

    return (
    <div id = "Login">
    <h1>
        Hi, This is our current login page :)
    </h1>

    <button onClick={(e) => (window.location = "http://localhost:5000/api/login")}>
        Login through Google! 
    </button>
    </div>
    )
}

export default Login