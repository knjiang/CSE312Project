import React from 'react';
import { Socket as socket } from '../../pages/Socket'
import './style.css'



class Chat extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            chat: '',
            lobby: '',
            lobbyChat: []
        }

        socket.on("receiveChat", function(data){
            this.setState({lobbyChat: data})
        }.bind(this))

        this.sendChat = this.sendChat.bind(this)
        this.changeChat = this.changeChat.bind(this)
        this.displayChat = this.displayChat.bind(this)
    }

    componentDidMount() {
        socket.emit("lobbyChat", null);
        this.setState({chat: '', lobbyChat: []})
    }

    componentDidUpdate() {
        this.newData.scrollIntoView({ behavior: "smooth" })
    }
    
    sendChat(e) {
        e.preventDefault();
        document.getElementById("inputChat").reset();
        let log = []
        log.push(this.props.param.user.email, this.state.chat)
        socket.emit("lobbyChat", log);
    }

    changeChat(e) {
        e.preventDefault();
        this.setState({chat: e.target.value})
    }

    displayChat(){
        let li = []
        li.push(<h1>ChatLog</h1>)
        for (let n of this.state.lobbyChat){
            if (n[0] == 'System'){
                li.push(<li className = "messages" style = {{color: 'blue', listStyleType: "none"}}>{n[0]}: {n[1]}</li>)
            }
            else{
                li.push(<li className = "messages" >{n[0]}: {n[1]}</li>)
            }
        }
        li.push(<div ref={(ref) => this.newData = ref}></div>)
        return(
            li
        )
    }

    render() {
    
        return (
            <div className = 'allChatContainer'>
                <div className = 'chatContainer'>
                    {this.displayChat()}
                </div>
                <form id = "inputChat" className = 'inputChat' onSubmit= {(e) => this.sendChat(e)}>
                    <input type = "text" onChange = {(e) => this.changeChat(e)}></input> <button type = "button" onClick = {(e) => this.sendChat(e)} className = 'chatButton'></button>
                </form>
            </div>

        );
    }
}

export default Chat