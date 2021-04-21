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

    const [background,setBack] = useState({
        background : 'light',
        light : true,
        background_color : '#FFF',
        text_color: '#363537'
    })

    const getUsers = () => {
        socket.on("logged", msg => {
            setOnline(msg);
        })
    }
    const logging_user = (data) => {
        setUser(data);
        data['add'] = true 
        socket.emit("logged", data)
    }
    
    const change_mode = () => {
        if (user.background == 'light'){
            user.background = 'dark'
            setBack({
                background : 'dark',
                light: false,
                background_color : '#999',
                text_color: '#FAFAFA'
            })
        }
        else{
            user.background = 'light'
            setBack({
                background: 'light',
                light: true,
                background_color : '#FFF',
                text_color: '#363537'
            })
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
    <div style ={{background : background.background_color,margin: 0,height : '100vh', width: '100vw',color:background.text_color}} id = "Homepage">
    <h1>
        Hi {user.user_name} and {user.user_email}, This is our current homepage   :)
    </h1>

    <p>
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
        {user.logged_in && background.light && light}
        {user.logged_in && !background.light && dark}
    </p>
    <LobbyList users = {online}>
    </LobbyList>
    </div>
    );
}

export default Home