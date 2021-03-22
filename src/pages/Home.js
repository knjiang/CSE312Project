import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"

function Home(){
    const [user,setUser] = useState({
        logged_in : false,
        user_name : 'Guest'
    })
     
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
            .then(data =>setUser(data))
    },[]);

    return (
    <div id = "Homepage">
    <h1>
        Hi {user.user_name}, This is our current homepage   :)
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
    </p>
    </div>
    );
}

export default Home