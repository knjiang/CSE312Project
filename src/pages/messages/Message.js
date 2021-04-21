import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "../../pages/Socket";

import './style.css'

class Message extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            user_email: null,
            chat: {},
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

        socket.on('allDM', function(tempData) {
            /*
            [["anthony", [[anthony: "hi"], [baron, "bye"], [anthony, "cool"]],
            ["ken", [[ken: "yo"], [ken: "wassup"], [baron: "my bad"]]]
            */
            let data = tempData[0]
            console.log("newDMupdate", data)
                /*
                bracket[0] is name of friend
                bracket[1] is collection of messages from old -> new
                */
            this.setState({chat: data[this.state.user_email]}, () => console.log("updatedDMSs", this.state.chat))
        }.bind(this))
    }

    componentDidMount() {
        socket.emit('updateDM', null)
        /*this.props.location.param[0] = me, this.props.location.param[1] = friend */
        if (this.props.location.param[0]){
            this.setState({focus: this.props.location.param[1], user_email: this.props.location.param[0], loaded: true}, () => console.log(this.state))
        }
    }

    showFocused() {
        console.log("FOCUSED", this.state.chat, this.state.focus, this.state.chat[this.state.focus])
       
        return (<h1 value = {this.state.focus} className = "focused" onClick = {(value) => this.setState({focus: value.target.textContent})}>{this.state.focus}</h1>)
    }
    showAll() {
        let p = []
        for (let n of Object.keys(this.state.chat)){
            if (n != this.state.focus){
                p.push(<h1 value = {this.state.focus} className = "focused" onClick = {(value) => this.setState({focus: value.target.textContent})} className = "friends">{n}</h1>)
            }
        }
        return p
    }

    render() {
        if (this.state.loaded){
            return(
                <div className = 'dmContainer'>
                    <div className = 'tabChat'>
                        {this.showFocused()}
                        {this.showAll()}
                    </div>
                    <div className = 'dmChat'>
                        <h1>{this.state.focus}</h1>
                    </div>
                </div>  
            )
        }
        else{
            return (
                <div><h1>loading</h1></div>
            )
        }
    }
}

export default Message