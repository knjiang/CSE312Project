import React from 'react';
import { Socket as socket } from '../pages/Socket'

class newPage extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            all_users: []
        }
        this.return_users = this.return_users.bind(this)
    }
    
    componentDidMount() {
        this.setState({all_users: []})
        socket.on("receivePlayer", function(data){
            console.log('data', data)
            this.setState({all_users: data})
        }.bind(this))
    }
    
    return_users() {
        console.log("STATE", this.state)
        return(
            this.state.all_users.map(product=><li>{product}</li>)
        )
    }

    render() {
        return(
            <div>
                    {this.return_users()}
            </div>
        )
    }
}

export default newPage