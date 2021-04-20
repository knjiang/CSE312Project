import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "../pages/Socket";

import LobbyList from "../components/LobbyList"

function Home(){
    
    const [user,setUser] = useState({
        logged_in : false,
        user_name : 'Guest',
        user_email : 'None',
        background : 'light'
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

    const light_mode = () => {
        if (user.background == 'light'){
            return false
        }
        return true
    }
    
    const change_mode = () => {
        if (user.background == 'light'){
            user.background = 'dark'
        }
        else{
            user.background = 'light'
        }
    }

    const light =   <button onClick = {change_mode}>
                        Toggle Dark Mode 
                    </button>

    const dark =    <button onClick = {change_mode}>
                        Toggle Light Mode 
                    </button>

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

    const playerJoinedDrawer = () => {
        socket.emit("emitPlayer", socket.id)
    }

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
    <h1>
        Hi {user.user_name} and {user.user_email}, This is our current homepage   :)
    </h1>

    <p>
        click on our current drawer, it's not draw with me yet though :(
        <br/>
        <br/>
        <br/>
        <Link to = {{
                pathname: '/drawer',
                param: user
                }}>
            <button onClick = {() => playerJoinedDrawer()}>
                Draw!
            </button>
        </Link>
        <br/>
        <br/>
        {user.logged_in && logout_button}
        {!user.logged_in && login_button}
        <br/>
        <br/>
        {user.logged_in && light_mode() && light}
        {user.logged_in && !light_mode() && dark}
    </p>
    <LobbyList users = {online}>
    </LobbyList>
    </div>
    );
}

export default Home