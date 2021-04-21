import React from 'react';
import { Link } from "react-router-dom"

function LobbyList(props){
    const returnLink = (a, b) => {
        if (a != b){
            return (            <Link to = {{
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
        <div style = {{display: "inlineFlex"}}><li key ="{user}">{user}</li> 
        {returnLink(props.me, user)}
        </div>
    );
    return (
        <div>
            <ul>
                {listUsers}
            </ul>
        </div>
    );
}

export default LobbyList