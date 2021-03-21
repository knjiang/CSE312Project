import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"

import io from "socket.io-client"

import LobbyList from "../components/LobbyList"

function Home(){
    const [user,setUser] = useState({
        logged_in : false,
        user_name : 'Guest',
        user_email : 'None'
    })
    const [online,setOnline] = useState([])

    const socket = io("http://localhost:5000")

    const getUsers = () => {
        socket.on("logged", msg => {
            setOnline(msg);
        })
    }
    const logging_user = (data) => {
        setUser(data);
        console.log('hi and me')
        socket.emit("logged", data)
        console.log('gottem',data)
    }
    const login_button = <Link to="/login">
                             <button>
                                 Login
                             </button>
                         </Link>
    
    const logout_button = <Link to="/logout">
                            <button>
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
    <h1>
        Hi {user.user_name} and {user.user_email}, This is our current homepage   :)
    </h1>

    <p>
        click on our current drawer, it's not draw with me yet though :(
        <br/>
        <br/>
        <br/>
        <Link to="/drawer">
            <button>
                Draw!
            </button>
        </Link>
        <br/>
        <br/>
        {user.logged_in && logout_button}
        {!user.logged_in && login_button}
        <LobbyList users = {online}>
        </LobbyList>
    </p>
    </div>
    );
}

export default Home