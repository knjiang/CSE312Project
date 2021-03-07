import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"

function Home(){
    const [logged_in,setLogged_In] = useState(false)

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
            .then(data => setLogged_In(data.logged_in))
        console.log(logged_in)
    });

    return (
    <div id = "Homepage">
    <h1>
        Hi, This is our current homepage   :)
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
        {logged_in && logout_button}
        {!logged_in && login_button}
    </p>
    </div>
    );
}

export default Home