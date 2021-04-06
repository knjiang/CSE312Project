import React  from 'react';
import Board from '../board/Board'
import Chat from '../chat/Chat'
import Players from '../players/Players';
import { Redirect } from 'react-router';
import { Socket as socket } from '../../pages/Socket'
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
            all_users: [],
            game_running: false,
            current_drawer: null,
            user_points: {},
            current_word: null
        }
        this.loadPoints = this.loadPoints.bind(this)
        this.testNextDrawer = this.testNextDrawer.bind(this)

        socket.on("newGame", function(data){
            console.log("NEWGAME", data)
            this.setState({current_drawer: data})
        }.bind(this))

        socket.on("newDrawer", function(data){
            console.log("NEWDRAWER", data)
            this.setState({current_drawer: data})
        }.bind(this))
    }

    loadPoints() {
        for (var users in this.state.all_users){
            if (!(users in this.state.all_users)){
                this.state.user_points[users] = 0
            }
        }
    }

    componentDidMount(){
        if (this.props.param.location.param) {
            this.setState({all_users: []})
            socket.on("receivePlayer", function(data){
                this.setState({all_users: data[0], load_1: true}, () => console.log("LOAD_1 COMPLETE"))
            }.bind(this))

            this.setState({
                load_2: true,
                user: {
                    email: this.props.param.location.param['user_email'],
                    name: this.props.param.location.param['user_name']
                }
            }, () => console.log("LOAD_2 COMPLETE"), console.log("USER JOINED WITH NAME AND EMAIL: " + this.state.user.email + ", " + this.state.user.name));
        }

        else {
            this.setState ({
                load_1: false
            })
        }
    }

    testNextDrawer () {
        socket.emit('nextDrawer', null)
    }

    render() {
        if (this.state.load_1 && this.state.load_2) {
            return(
                <div className = "container">
                    {this.loadPoints()}
                    <button onClick = {() => this.testNextDrawer()}>FOR TESTING: NEXT DRAWER</button>
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
        else if (this.state.load == false){
            return (<Redirect to="/" />)
        }
        else {
            return(
                <div>
                    <h1>If this screen persists, click here to rejoin</h1>
                    <a href="/">
                        Reload the page
                        </a>
                </div>
            )
        }
    }
}

export default Container