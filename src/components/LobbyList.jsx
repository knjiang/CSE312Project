import React from 'react';
import { Link } from "react-router-dom"
import "./style.css"

function LobbyList(props){
    const returnLink = (a, b) => {
        if (a != b){
            return ( <Link to = {{
                pathname: '/messages',
                param: [a, b]
                }}>
                <button>
                    Message {b}
                </button>
            </Link>)
        }
    }
    const listUsers = props.users.map((user) =>
        <div style = {{display: "flex-wrap", textAlign: "center"}}><li key ="{user}">{user}</li> 
        {returnLink(props.me, user)}
        </div>
    );
    return (
        <div>
            <ul className = "list_style">
                {listUsers}
            </ul>
        </div>
    );
}

export default LobbyList