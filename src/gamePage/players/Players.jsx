import React from 'react';

import './style.css'

class Players extends React.Component {

    constructor (props) {
        super (props);

    }


    render() {
        return(
            <div className = 'playersContainer'>
                <h1>Players</h1>
            </div>
        )
    }
}

export default Players