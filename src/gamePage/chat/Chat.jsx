import React from 'react';

import './style.css'



class Chat extends React.Component {

    constructor (props) {
        super (props);

    }
    



    render() {
        let messages = (
            {"baron": "Hi! How are you"},
            {"name1": "Great, wtf is happening"},
            {"name2": "DKSDDDDD"}
        );
        let addChat = Object.keys(messages).map(function(name) {
            return <h1> {name}: {messages[name]} </h1>
        });

        return (
            
            <div className = 'chatContainer'>
                <h1>HI</h1>
                {addChat}
            </div>
        )
    }
}

export default Chat