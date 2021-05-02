import React from 'react';
import { Socket as socket } from '../../pages/Socket'
import { Link } from "react-router-dom"

import './style.css'

class Players extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            inGame_users: null,
            game_running: false,
            current_drawer: null,
            user_points: {},
            loaded: false
        }
        this.return_users = this.return_users.bind(this)
    }
    
    componentDidMount() {
        this.setState({inGame_users: this.props.param.inGame_users, current_drawer: this.props.param.current_drawer, user_points: this.props.param.user_points, loaded: true}, () => "Players loaded with:", "State: ", this.state, "Props", this.props.param)
    }

    componentDidUpdate() {
        if (this.props.param.inGame_users != this.state.inGame_users){
            this.setState({inGame_users: this.props.param.inGame_users})
        }
        if (this.props.param.user_points != this.state.user_points){
            this.setState({user_points: this.props.param.user_points})
        }
    }

    return_users() {
        let li = []
        li.push(<li style = {{fontSize: '4vh', margin: '2vh', fontWeight: 'Bold', listStyleType: "none"}}> Players </li>)
        if (this.state.inGame_users != null && typeof this.state.inGame_users[Symbol.iterator]){
            for (let i of this.state.inGame_users){
                //props and state dont update at the same time, state lags
                if ((i == this.props.param.user.email) && (i == this.props.param.user.email)){
                    li.push(<li className = "playerList" style = {{fontWeight: 'Bold', color: 'navy', listStyleType: "none"}}> {i}: {this.state.user_points[i]} </li>)
                }
                else if (i == this.props.param.current_drawer){
                    li.push(<li className = "playerList" style = {{fontWeight: 'Bold', listStyleType: "none"}}> {i}: {this.state.user_points[i]}</li>)
                }
                else if (i == this.props.param.user.email){
                    li.push(<li className = "playerList" style = {{color: 'green', listStyleType: "none"}}> {i}: {this.state.user_points[i]} </li>)
                }
                else{
                    li.push(<li className = "playerList" style = {{listStyleType: "none"}}> {i}: {this.state.user_points[i]} </li>)
                }
            }
            return(
                li
            )
        }
        else{
            return <li>No players found</li>
        }
    }

    render() {
        if  (this.state.loaded){
            return(
                <div className = "playersContainer">
                    {this.return_users()}
                </div>
            )
        }
        else {
            return (<h1></h1>)
        }
    }
}

export default Players