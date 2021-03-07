import React from 'react';
// import './style.css';
import { Link } from "react-router-dom"

// Currently app.js needs react-router-dom to create the endpoints. 
// Currently the master branch can only run the drawing component
// Need to check if the homepage can parse the username from the email when user OAuth sign in/sign up

class homePage extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className = "Main">
                <li className = "inputUsername">
                    <form>
                        <input type = "text" placeholder = "Enter your name"></input>
                    </form>
                </li>
                <Link to="./container/Container.jsx">
                    <button>Draw!</button>
                </Link>
            </div>
        )
    }
}