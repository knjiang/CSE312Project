import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "../../pages/Socket";

import './style.css'

class Message extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            sendChat: '',
            user_email: null,
            chat: null,
            focus: null,
            loaded: false
            /*
            {"ken": [[ken: "yo"], [ken: "wassup"], [baron: "my bad"]],
             "anthony": [[anthony: "hi"], [baron, "bye"], [anthony, "cool"]],
             "evan": [[baron, "answer?"], [baron, "only me here"]]}
            */
        }
        this.showFocused = this.showFocused.bind(this)
        this.showAll = this.showAll.bind(this)
        this.showChat = this.showChat.bind(this)
        this.changeMSG = this.changeMSG.bind(this)
        this.sendMSG = this.sendMSG.bind(this)

        socket.on('allDM', function(tempData) {
            /*
            [["anthony", [[anthony: "hi"], [baron, "bye"], [anthony, "cool"]],
            ["ken", [[ken: "yo"], [ken: "wassup"], [baron: "my bad"]]]
            */
            let data = tempData[0]
                /*
                bracket[0] is name of friend
                bracket[1] is collection of messages from old -> new
                */
            this.setState({chat: data[this.state.user_email]})
        }.bind(this))
    }

    componentDidMount() {
        socket.emit('updateDM', null)
        /*this.props.location.param[0] = me, this.props.location.param[1] = friend */
        console.log("ENTERED MSG WITH", this.props.location.param)
        if (this.props.location.param[0]){
            this.setState({focus: this.props.location.param[1], user_email: this.props.location.param[0], loaded: true}, () => console.log("MSG ONLOAD", this.state))
        }

    }

    showFocused() {
        if (this.state.focus){
            return (<h1 value = {this.state.focus} className = "focused" onClick = {(value) => this.setState({focus: value.target.textContent})}>{this.state.focus}</h1>)
        }
    }
    showAll() {
        let p = []
        for (let n of Object.keys(this.state.chat)){
            if (n != this.state.focus || n != this.state.user_email){
                p.push(<h1 value = {this.state.focus} className = "focused" onClick = {(value) => this.setState({focus: value.target.textContent})} className = "friends">{n}</h1>)
            }
        }
        return p
    }
    showChat() {
        if (this.state.focus && this.state.chat){
            let l = []
            for (let m of this.state.chat[this.state.focus]){
                if (m[0] == this.state.user_email){
                    l.push(<h1 className = 'userMSG'>{m[0]}: {m[1]}</h1>)
                }
                else{
                    l.push(<h1 className = 'friendMSG'>{m[0]}: {m[1]}</h1>)
                }
            }
            l.push(<form id = "inputMSG" className = 'inputMSG' onSubmit= {(e) => this.sendMSG(e)}>
            <input className = "inputChatDM" type = "text" onChange = {(e) => this.changeMSG(e)}></input> <button type = "button" onClick = {(e) => this.sendMSG(e)} className = 'dmButton'></button>
        </form>)
            return l
        }
        else if (this.state.focus && !this.state.chat){
            return (<form id = "inputMSG" className = 'inputMSG' onSubmit= {(e) => this.sendMSG(e)}>
            <input className = "inputChatDM" type = "text" onChange = {(e) => this.changeMSG(e)}></input> <button type = "button" onClick = {(e) => this.sendMSG(e)} className = 'dmButton'></button>
        </form>)
        }
        else {
            return <h1>Please selected an user to view message</h1>
        }
    }

    changeMSG(e) {
        e.preventDefault();
        this.setState({sendChat: e.target.value})
    }

    sendMSG(e) {
        e.preventDefault();
        document.getElementById("inputMSG").reset();
        let log = []
        log.push(this.state.user_email, this.state.focus, this.state.sendChat)
        console.log("Chat Sent", log)
        socket.emit("updateDM", log);
    }

    render() {
        if (this.state.loaded && !this.state.chat && !this.state.focus) {
            return(
                <div className = 'dmContainer'>
                    You do not have any active messages, please start a private message from the homepage
                </div>  
            )
        }
        if (this.state.loaded && !this.state.chat && this.state.focus) {
            return(
                <div className = 'dmContainer'>
                    <div className = 'tabChat'>
                        {this.showFocused()}
                    </div>
                    <div className = 'dmChat'>
                        {this.showChat()}
                    </div>
                </div>  
            )
        }
        else if (this.state.loaded){
            return(
                <div className = 'dmContainer'>
                    <div className = 'tabChat'>
                        {this.showFocused()}
                        {this.showAll()}
                    </div>
                    <div className = 'dmChat'>
                        {this.showChat()}
                    </div>
                </div>  
            )
        }
        else{
            return (<div> Leading </div>)
        }
    }
}

export default Message