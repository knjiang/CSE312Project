import React from 'react';

function LobbyList(props){
    const listUsers = props.users.map((user) =>
        <li key ="{user}">{user}</li>
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