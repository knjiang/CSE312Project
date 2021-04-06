import React from 'react';
import { Socket as socket } from '../../pages/Socket'
import { Link } from "react-router-dom"

import './style.css'

class Players extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            all_users: [],
            game_running: false,
            current_drawer: null,
            user_points: {},
        }
        this.return_users = this.return_users.bind(this)
    }
    
    componentDidMount() {
        console.log("PLAYER PARAM", this.props.param)
        this.setState({all_users: this.props.param.all_users, current_drawer: this.props.param.current_drawer})
    }

    componentDidUpdate() {
        if (this.props.param.all_users != this.state.all_users){
            this.setState({all_users: this.props.param.all_users, current_drawer: this.props.param.current_drawer}, () => (this.return_users(), console.log("PLAYERS UPDATED", this.props.param, this.state)))
        }
    }


    return_users() {
        let li = []
        for (let i of this.state.all_users){
            //props and state dont update at the same time, state lags
            console.log("RETURNUSERSs", i, this.state.current_drawer, this.props.param.current_drawer)
            if (i == this.props.param.current_drawer){
                console.log("SAMESAMEs")
                li.push(<li style = {{fontWeight: 'Bold'}}> {i} </li>)
            }
            else{
                li.push(<li> {i} </li>)
            }
        }
        return(
            li
        )
    }

    render() {
        return(
            <div className = "playersContainer">
                {this.return_users()}
            </div>
        )
    }
}

export default Players