import React, {Component} from "react"
import { Socket as socket } from '../../pages/Socket'
import './style.css'


class Room extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            chat: '',
            lobby: '',
            lobbyChat: [],
            onlineUsers:[]
        }

        socket.on("receiveChat", function(data){
            for (let i of data){
                this.setState({lobbyChat: data}, () => console.log("CHAT RECEIVED", this.state.lobbyChat))
            }
        }.bind(this))

        socket.on("answerFound", function(data){
            socket.emit('nextDrawer', null)
            console.log("NEXT DRAWWER PLZ")
        }.bind(this))

        socket.on("get_email", function(data){
            for (let i of data){
            this.setState({onlineUsers: data}, () => console.log("PEOPLE ONLINE", this.state.onlineUsers))
            }
        }.bind(this))

        this.sendChat = this.sendChat.bind(this)
        this.changeChat = this.changeChat.bind(this)
        this.displayChat = this.displayChat.bind(this)
        this.displayUsers = this.displayUsers.bind(this)
    }

    componentDidMount() {
        socket.emit("lobbyChat", null);
        this.setState({chat: '', lobbyChat: []})
        socket.emit("onlineUsers", null);
        this.setState({onlineUsers:[]})

    }

    componentDidUpdate() {
        this.newData.scrollIntoView({ behavior: "smooth" })
        socket.emit("lobbyChat", null);
        socket.emit("onlineUsers", null);
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
                li.push(<li style = {{fontWeight: 'bold'}}>{n[0]}: {n[1]}</li>)
            }
            else{
                li.push(<li>{n[0]}: {n[1]}</li>)
            }
        }
        li.push(<div ref={(ref) => this.newData = ref}></div>)
        return(
            li
        )
    }

    displayUsers(){
        let online_users = []
        online_users.push(<h1>Online Users</h1>)
        for (let n of this.state.onlineUsers){
            online_users.push(<button>{n}</button>)
        }
        return(
            online_users
        )
    }

    switchChat(e){
        console.log("works")
    }

    render() {
        return (
            <div>
                {this.displayUsers()}
                <div className = 'chatContainer' onClick = {(e) => this.switchChat(e)}>
                    {this.displayChat()}
                </div>
                <form id = "inputChat" className = 'inputChat' onSubmit= {(e) => this.sendChat(e)}>
                    <input type = "text" onChange = {(e) => this.changeChat(e)}></input> <button type = "button" onClick = {(e) => this.sendChat(e)} className = 'chatButton'></button>
                </form>
            </div>
        );
    }
}

export default Room
