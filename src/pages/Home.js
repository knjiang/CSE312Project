import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "../pages/Socket";

import LobbyList from "../components/LobbyList"

import './style.css'

function Home(){
    
    const [user,setUser] = useState({
        logged_in : false,
        user_name : 'Guest',
        user_email : 'None'
    })
    const [online,setOnline] = useState([])


    const getUsers = () => {
        socket.on("logged", msg => {
            setOnline(msg);
        })
    }
    const logging_user = (data) => {
        setUser(data);
        console.log('hi and me')
        data['add'] = true 
        socket.emit("logged", data)
        console.log('gottem',data)
    }

    const delete_user = () => {
        var data = {...user}
        data['add'] = false 
        console.log(data)
        socket.emit("logged", data)
        console.log('finished emitting')
    }
    const login_button = <Link to="/login">
                             <button>
                                 Login
                             </button>
                         </Link>
    
    const logout_button = <Link to="/logout">
                            <button onClick = {delete_user}>
                                Logout
                            </button>
                          </Link>

    useEffect(()=>{
        fetch("/api/verify_login")
            .then(response => response.json())
            .then(data =>logging_user(data))
        fetch("/api/online_users")
            .then(response => response.json())
            .then(data => setOnline(data.members));
        getUsers(); 
    },[]);

    return (
    <div id = "Homepage">
    <h1 className = "title">
        Draw With Me!
    </h1>
    <h1 className = "intro">
        Hi {user.user_name} and {user.user_email}, This is our current homepage   :)
    </h1>
        <br/>
        <br/>
        <br/>
        <div className = "homepage_buttons">
        <h1 className = "home_divs">Navigation</h1>
        <Link to = {{
                pathname: '/drawer',
                param: user
                }}>
            <button className = "draw_button" onClick = {() => (console.log("drawer button clicked for : " + user.user_email))}>
                Draw!
            </button>
        </Link>
        <br/>
        <br/>
        <Link to = {{
                pathname: '/messages',
                param: [user.user_email]
                }}>
            <button className = "message_button" onClick = {() => (console.log("drawer button clicked for : " + user.user_email))}>
                Messages!
            </button>
        </Link>
        <br/>
        <br/>
        {user.logged_in && logout_button}
        {!user.logged_in && login_button}
        </div>
        <div className = "online_users">
            <h1 className = "home_divs">Online Users!</h1>
    <LobbyList users = {online} me = {user["user_email"]}>
    </LobbyList>
    </div>
    </div>
    );
}

export default Home