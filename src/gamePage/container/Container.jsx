import React from 'react';
import Board from '../board/Board'
import Chat from '../chat/Chat'
import Players from '../players/Players';

import './style.css'

class Container extends React.Component {

    constructor (props) {
        super (props);

    }


    render() {
        return(
            <div className = "container">

                <div >
                    <Players/>
                </div>

                <div >
                    <Board />
                </div>

                <div >
                    <Chat />
                </div>

            </div>
        )
    }
}

export default Container