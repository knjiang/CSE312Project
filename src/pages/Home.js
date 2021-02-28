import React from "react"
import { Link } from "react-router-dom"

const Home = () => (
    <div id = "Homepage">
    <h1>
        Hi, This is our current homepage   :)
    </h1>

    <p>
        click on our current drawer, it's not draw with me yet though :(
        <br/>
        <br/>
        <br/>
        <Link to="/drawer">
            <button>
                Draw!
            </button>
        </Link>
        <br/>
    </p>
    </div>
)

export default Home