import React, {useState,useEffect} from "react"
import { Link } from "react-router-dom"
import {Socket as socket} from "../Socket";

import './style.css'

class Gallery extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            "focus": null,
            "allUsers": [],
            "imagery": [],
            "search": ""
        }

        socket.on("getMembers", function(data){
            this.setState({allUsers: data})
        }.bind(this))

        socket.on("displayImage", function(data){
            this.setState({imagery: data})
            console.log("display image socket received", data.length)
        }.bind(this))

        this.displayTabs = this.displayTabs.bind(this)
        this.displayGallery = this.displayGallery.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.openImage = this.openImage.bind(this)
        this.searcher = this.searcher.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
    }

    componentDidMount() {
        console.log("Gallery Mounted: ", this.props.location.param)
        if (this.props.location.param){
            let email = this.props.location.param[0]
            this.setState({"imagery": [], "focus": email, "search": ""}, () => (socket.emit("getMembers", 4), socket.emit("getImage", email)))
        }
        else {
            this.setState({"imagery": [], "focus": null, "search": ""})
            socket.emit("getMembers", 4)
        }
    }

    handleFocus(e, m) {
        e.preventDefault()
        console.log("handleFocus clicked")
        this.setState({focus: m})
        socket.emit("getImage", m)
    }

    displayTabs() {
        console.log("Display Tabs", this.state)
        let res = []
        if (this.state.allUsers){
            for (let m of this.state.allUsers){
                if (m == this.state.focus && this.state.search == null){
                    res.push(<div><div className = "makeBorder"></div><h1 style = {{color: "blue"}} className = 'emails' onClick = {(e) => this.handleFocus(e, m)}>{m}</h1></div>)
                }
                else if (this.state.search == null){
                    res.push(<div><div className = "makeBorder"></div><h1 className = 'emails' onClick = {(e) => this.handleFocus(e, m)}>{m}</h1></div>)
                }
                else if (m == this.state.focus && m.toUpperCase().includes(this.state.search.toUpperCase())){
                    res.push(<div><div className = "makeBorder"></div><h1 style = {{color: "blue"}} className = 'emails' onClick = {(e) => this.handleFocus(e, m)}>{m}</h1></div>)
                }
                else if (m.toUpperCase().includes(this.state.search.toUpperCase())){
                    res.push(<div><div className = "makeBorder"></div><h1 className = 'emails' onClick = {(e) => this.handleFocus(e, m)}>{m}</h1></div>)
                }
            }
            return res
        }
        else{
            return (<h1>Not loaded or no users retrived</h1>)
        }
    }

    openImage(e, m) {
        e.preventDefault()
        var winImage = window.open("");
        let image = new Image()
        image.src = m
        winImage.document.write(image.outerHTML);
    }

    deleteImage(e, m, p) {
        e.preventDefault()
        socket.emit("deleteImage", [m, p])
    }


    displayGallery() {
        if (this.state.focus){
            let imageList = []
            if (this.state.imagery) {
                if (this.props.location.param){
                    if (this.state.focus == this.props.location.param[0]){
                        for (let m of this.state.imagery){
                            imageList.push(<div className = 'imgWrapper'><img onClick = {(e) => this.openImage(e, m)} className = 'imgs' src = {m}></img><br/><button style = {{marginBottom: "3vh"}} onClick = {(e) => this.deleteImage(e, m, this.state.focus)}>Delete</button></div>)
                        }
                    }
                    else {
                        for (let m of this.state.imagery){
                            imageList.push(<div className = 'imgWrapper'><img onClick = {(e) => this.openImage(e, m)} className = 'imgs' src = {m}></img><br/></div>)
                        }
                    }
                }
                else{
                    for (let m of this.state.imagery){
                        imageList.push(<div className = 'imgWrapper'><img onClick = {(e) => this.openImage(e, m)} className = 'imgs' src = {m}></img><br/></div>)
                    }
                }
            }
            return(imageList)
        }
        else{
            return (<div style = {{width: "75vw"}}><h1 style = {{textAlign: "center"}}>Click on a user to view their gallery</h1></div>)
        }
    }

    searcher() {
        return(
        <form className = 'searchContainer'>
            <label>
                Search for users:
                <input onChange = {(e) => this.setState({"search": e.target.value})} type="text" name="email" />
            </label>
        </form>
        )
    }

    render() {
        return(
            <div className = 'galleryContainer'>
                <div className = "tabs">
                <div>
                    {this.searcher()}
                </div>
                    {this.displayTabs()}
                </div>
                <div className = "gal">
                    <h1 style = {{fontSize: "4.5vh", position: "fixed", margin: "auto", textAlign: "center", top: "1vh", right: "33%"}}>Welcome to the Gallery</h1>
                    {this.displayGallery()}
                </div>

            </div>
        )
    }
}

export default Gallery