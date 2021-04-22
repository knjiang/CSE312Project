import React, { useState,useEffect } from "react"
import { Link } from "react-router-dom"

import './style.css'

function Login(){

    return (
    <div id = "Login">
    <h1 className = "title">
        Draw With Me!
    </h1>

    <button className = "login_button" onClick={(e) => (window.location = "http://localhost:5000/api/login")}>
        Login through Google! 
    </button>
    </div>
    )
}

export default Login