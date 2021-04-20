import React, {Component}  from 'react';
import Board from '../board/Board'
import Room from './Room'
import Players from '../players/Players';
import { Redirect } from 'react-router';
import { Socket as socket } from '../../pages/Socket'
import { Link } from "react-router-dom"

class Chats extends Component {

    constructor (props) {
        super (props);

        this.state = {
            load_1: null,
            load_2: null,
            user: {
                email: '',
                name: ''
            },
            all_users: [],
            game_running: false,
            current_drawer: null,
            user_points: {},
            wordList: null,
            current_word: null
        }
    }

    // componentDidMount(){
    //     if (this.props.param.location.param) {
    //         this.setState({all_users: []})
    //         socket.on("receivePlayer", function(data){
    //             this.setState({all_users: data[0], load_1: true}, () => console.log("LOAD_1 COMPLETE"))
    //         }.bind(this))

    //         this.setState({
    //             load_2: true,
    //             user: {
    //                 email: this.props.param.location.param['user_email'],
    //                 name: this.props.param.location.param['user_name']
    //             }
    //         }, () => console.log("LOAD_2 COMPLETE"), console.log("USER JOINED WITH NAME AND EMAIL: " + this.state.user.email + ", " + this.state.user.name));
    //     }

    //     else {
    //         this.setState ({
    //             load_1: false
    //         })
    //     }
    // }

    // testNextDrawer () {
    //     socket.emit('nextDrawer', null)
    // }

    render() {
        // if (this.state.load_1 && this.state.load_2) {
            return(
                <div classname="Container">
                    {/* {this.loadPoints()}
                    <button onClick = {() => this.testNextDrawer()}>FOR TESTING: NEXT DRAWER</button> */}
                    {/* <div>
                        <Players param = {this.state}/>
                    </div> */}

                    {/* <div >
                        <Board param = {this.state}/>
                    </div> */}
    
                    <div >
                        <Room param = {this.state}/>
                    </div>
    
                </div>
            );
        // }
        // else if (this.state.load == false){
        //     return (<Redirect to="/" />)
        // }
        // else {
        //     return(
        //         <div>
        //             <h1>If this screen persists, click here to rejoin</h1>
        //             <a href="/">
        //                 Reload the page
        //                 </a>
        //         </div>
        //     )
        // }
    }
}

export default Chats