import React, { useState,useEffect } from "react"
import { Link } from "react-router-dom"

function Login(){
    const [redirect,setRedirect] = useState("")

    useEffect(()=>{
        fetch("/api/login")
            .then(response => response.json())
            .then(data => setRedirect(data.url))
        console.log(redirect)
    },[]);

    return (
    <div id = "Login">
    <h1>
        Hi, This is our current login page :)
    </h1>

    <button onClick={(e) => (window.location = {redirect})}>
        Login through Google! 
    </button>
    </div>
    )
}

export default Login