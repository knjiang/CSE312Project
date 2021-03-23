import React from 'react';
import { io } from 'socket.io-client';
import './style.css'



class Chat extends React.Component {

    socket = io.connect("http://localhost:5000")

    constructor (props) {
        super (props);

        this.state = {
            chat: '',
            lobby: '',
            lobbyChat: []
        }

        this.socket.on("lobby-chat", function(chat){
            this.setState({lobbyChat: chat}, () => console.log(this.state.lobbyChat))
        }.bind(this))

        this.sendChat = this.sendChat.bind(this)
        this.changeChat = this.changeChat.bind(this)
    }

    componentDidMount() {
        console.log("LOBBY CHAT WHEN INITIALIZED", this.state.lobbyChat)
        this.socket.emit("lobby-chat", '');
        this.setState({chat: '', lobbyChat: []})
    }
    
    sendChat(e) {
        e.preventDefault();
        document.getElementById("inputChat").reset();
        this.socket.emit("lobby-chat", this.state.chat);
    }

    changeChat(e) {
        e.preventDefault();
        this.setState({chat: e.target.value})
    }

    render() {
        
        return (
            <div>
                <div className = 'chatContainer'>
                    <h1>Chat</h1>
                    {
                        Object.keys(this.state.lobbyChat).map((i, j) => (
                            <h1 className = "messages">user: {this.state.lobbyChat[i]}</h1>
                        ))
                    }
                </div>
                <form id = "inputChat" className = 'inputChat' onSubmit= {(e) => this.sendChat(e)}>
                    <input type = "text" onChange = {(e) => this.changeChat(e)}></input> <button type = "button" onClick = {(e) => this.sendChat(e)} className = 'chatButton'></button>
                </form>
            </div>

        );
    }
}

export default Chat