import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "./Socket";

import LobbyList from "../components/LobbyList"

import './style.css'

function Home(){
    
    const [user,setUser] = useState({
        logged_in : false,
        user_name : 'Guest',
        user_email : 'None',
        background : 'light',
        light : true,
        background_color : '#FFF',
        text_color: '#363537'
    })

    const userRef = React.useRef()
    userRef.current = user;

    const [online,setOnline] = useState([])
    const [noti,setNoti] = useState([])

    const notiRef = React.useRef()
    notiRef.current = noti;

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
        var updated_user = {}
        if (user.background == 'light'){
            updated_user = {...user,
                background : 'dark',
                light: false,
                background_color : '#999',
                text_color: '#FAFAFA'
            }
            setUser(updated_user)
        }
        else{
            updated_user = {...user,
                background: 'light',
                light: true,
                background_color : '#FFF',
                text_color: '#363537'
            }
            setUser(updated_user)
        }
        fetch('/api/light_mode', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updated_user),
            })
            .then(response => response.json())
            .then(data => {
            console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
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
                          
    const drawButton = <Link to = {{
                        pathname: '/drawer',
                        param: user
                        }}>
                    <button className = "draw_button" onClick = {() => (console.log("drawer button clicked for : " + user.user_email))}>
                        Draw!
                    </button>
                </Link>

    const noDrawButton = <button>Please login to play or spectate</button>

    const displayNotifications = notiRef.current.map((user) =>
        <h1 className = "notiList">Unread message from: {user}</h1>
    );

    const greetUser = <h1 className = "intro">  Hi {user.user_name} and {user.user_email}, This is our current homepage   :)</h1>
    const greetGuest = <h1 className = "intro">  Hi guest, This is our current homepage   :)</h1>
    /*
    const updateNoti = () => {
        console.log("displaying Noti", notiRef.current)
        let p = []
        for (let m of notiRef.current){
            p.push(<h1>Unread message from {m}</h1>)
        }
        console.log("did it change?", displayNotifications)
    } 
    */
    const noNotifications = <h1 style = {{fontSize: "1vh"}}>No notifications</h1>

    useEffect(()=>{
        fetch("/api/verify_login")
            .then(response => response.json())
            .then(data =>logging_user(data))
        fetch("/api/online_users")
            .then(response => response.json())
            .then(data => setOnline(data.members));
        getUsers(); 
        socket.on("retrieveNotification", data => {
            //email, notifications
            let email = data[0]
            let noti = data[1]
            //console.log("notifications", email, userRef.current['user_email'], data && email == userRef.current['user_email'])
            if (data && email == userRef.current['user_email']){
                setNoti(noti)
            }
        });
    },[]);


    return (
        <div style ={{background : user.background_color,margin: 0,height : '100vh', width: '100vw',color:user.text_color}} id = "Homepage">
        <h1 className = "title">
            Draw With Me!
        </h1>
            {user.user_email && greetUser}
            {!user.user_email && greetGuest}
            <br/>
            <br/>
            <br/>
            <div className = "container_divs">
                <div className = "homepage_buttons">
                    <h1 className = "home_divs">Navigation</h1>
                    {user.logged_in && drawButton}
                    {!user.logged_in && noDrawButton}
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
    
                    <Link to = {{
                            pathname: '/gallery',
                            param: [user.user_email]
                            }}>
                        <button className = "message_button">
                            Gallery!
                        </button>
                    </Link>
                    <br/>
                    <br/>
                    {user.logged_in && logout_button}
                    {!user.logged_in && login_button}
                    <br/>
                    <br/>
                    {user.logged_in && user.light && light}
                    {user.logged_in && !user.light && dark}
                </div>
                <div className = "online_users">
                    <h1 className = "home_divs">Online Users!</h1>
                    <LobbyList users = {online} me = {user["user_email"]}>
                    </LobbyList>
                </div>
               
                <div className = "notifications">
                    <h1 className = "home_divs">Notifications</h1>
                    <div>
                        {noti.length > 0 && displayNotifications}
                        {noti.length == 0 && noNotifications}
                    </div>
                </div>

            </div>
        </div>
        );
    }

export default Home

