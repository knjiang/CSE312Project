import React  from 'react';
import BoardDrawer from '../board/BoardDrawer'
import Board from '../board/Board'
import Chat from '../chat/Chat'
import Players from '../players/Players';
import { Redirect } from 'react-router';
import { Prompt } from 'react-router-dom'
import { Socket as socket } from '../../pages/Socket'
import { io } from 'socket.io-client';
import { Link } from "react-router-dom"
import './style.css'

class Container extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            load_1: null,
            load_2: null,
            user: {
                email: '',
                name: ''
            },
            inGame_users: {},
            game_running: false,
            current_drawer: null,
            wordList: null,
            current_word: null,
            user_points: {},
            timer: 30,
        }
        this.loadPoints = this.loadPoints.bind(this)
        this.startGame = this.startGame.bind(this)
        this.disconnectGame = this.disconnectGame.bind(this);
        this.enoughPlayers = this.enoughPlayers.bind(this)

        socket.on("newDrawer", function(data){
            socket.emit("gameStatus", ["retrieve", "retrieve"]);
            if (data){
                if (data[0] && data[1]){
                    this.setState({current_drawer: data[0], current_word: data[1]})
                    this.setState({timer: 30}, () => this.updateTimer)
                }
            }
        }.bind(this))

        socket.on("gameUsers", function(data){
            console.log("In Game Users Changed", data)
            this.setState({inGame_users: data})
            for (let p of data[3]){
                this.setState({user_points: p[0]})
            }
            console.log("gameUsersPoints", this.state.user_points)
        }.bind(this))

        socket.on("timerUp", function(data){
            if (this.state.current_drawer == this.state.user["email"]){
                this.startGame()
            }
        }.bind(this))

        socket.on("timerLeft", function(data){
            this.setState({timer: data})
        }.bind(this))

        socket.on("endGame", function(data){
            this.setState({game_running: false})
        }.bind(this))
    }

    loadPoints() {
        for (var users in this.state.all_users){
            if (!(users in this.state.all_users)){
                this.state.user_points[users] = 0
            }
        }
    }

    startGame() {
        socket.emit('newDrawer', null)
    }

    componentDidMount(){
        if (this.props.param.location.param) {
            this.setState({
                load_2: true,
                user: {
                    email: this.props.param.location.param['user_email'],
                    name: this.props.param.location.param['user_name']
                }}, () => {
                    socket.emit('gameStatus', ["connectGame", this.state.user.email])
                    socket.on("gameUsers", function(data){
                        console.log("GAMEUSER", data)
                        let po = {}
                        for (let u of data[3]){
                            po[u[0]] = u[1]
                        }
                        this.setState({inGame_users: data[0], current_drawer: data[1], current_word: data[2], user_points: po, load_1: true})
                    }.bind(this))
                }
            )
        }

        else {
            this.setState ({
                load_1: false
            })
        }
    }
    /*
    componentDidUpdate () {
        window.onpopstate = e => {
            socket.emit('gameStatus', [false, this.state.user.email])
         }
    }
    */
    disconnectGame() {
        socket.emit('gameStatus', ["disconnectGame", this.state.user.email])
        if (this.state.current_drawer == this.state.user.email){
            socket.emit('newDrawer', null)
        }
    }

    enoughPlayers() {
        if (Object.keys(this.state.inGame_users).length > 1 && this.state.current_drawer == null){
            return (<button onClick = {() => this.startGame()}>New Game</button>)
        }
        else if (Object.keys(this.state.inGame_users).length > 1 && this.state.current_drawer != null){          
            return <h1>{this.state.current_drawer} is currently drawing with {this.state.timer} seconds remaining </h1>
        }
        else{
            return (<h1>Need more players</h1>)
        }
    }

    render() {
        if (this.state.load_1 && this.state.load_2) {
            if (this.state.current_drawer == this.state.user.email) {
                return(
                    <div className = "container">
                        <div className = "drawerInfo">
                            <button onClick= {() => (this.disconnectGame())}>Disconnect from game</button>
                            <h1 style = {{fontSize: "4vh"}}>You are currently drawing:"{this.state.current_word}" </h1>
                        </div>
                            
                            <div>
                                <Players param = {this.state}/>
                            </div>
        
                            <div >
                                {/*need to make sure to have 2 boards, one for drawer and one for rest */}
                                <BoardDrawer param = {this.state}/>
                            </div>
            
                            <div >
                                <Chat param = {this.state}/>
                            </div>

                    </div>
                )
            }
            else {
                return(
                    <div className = "container">
                        <div className = "drawerInfo">
                            <button onClick= {() => (this.disconnectGame())}>Disconnect from game</button>
                            {this.enoughPlayers()}
                        </div>
                            <div>
                                <Players param = {this.state}/>
                            </div>
        
                            <div >
                                {/*need to make sure to have 2 boards, one for drawer and one for rest */}
                                <Board param = {this.state}/>
                            </div>
            
                            <div >
                                <Chat param = {this.state}/>
                            </div>
        
                    </div>
                )
            }
        }
        else if (this.state.load == false){
            return (
            <div>
            <Redirect to="/" /> </div>)
        }
        else {
            return(
                <div>
                    <h1>Please enter from the homepage</h1>
                    <a href="/">
                        Reload the page
                        </a>
                </div>
            )
        }
    }
}

export default Container