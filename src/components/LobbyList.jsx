import React from 'react';
import { Link } from "react-router-dom"

function LobbyList(props){
    const listUsers = props.users.map((user) =>
        <div style = {{display: "inlineFlex"}}><li key ="{user}">{user}</li> 
            <Link to = {{
                pathname: '/messages',
                param: [props.me, user]
                }}>
                <button onClick = {() => (console.log("ME", props, user))}>
                    Message
                </button>
            </Link>
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