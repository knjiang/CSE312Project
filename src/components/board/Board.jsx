import React from 'react';
import './style.css';
import { Socket as socket } from '../../pages/Socket'

class BoardDrawer extends React.Component {

    timeout;

    constructor(props) {
        super(props);

        this.state = {
            isDrawer: null,
            current_drawer: null,
        }

        socket.on("receive_canvas", function(data){
            console.log("recevived_canvas", this.state.current_drawer, data[1])
            if (this.state.current_drawer == data[1]){
                var image = new Image();
                var canvas = document.querySelector('#board');
                var canvas_data = canvas.getContext('2d');
                image.onload = function() {
                    canvas_data.drawImage(image, 0, 0);
                };
                image.src = data[0];
            }
        }.bind(this))


        this.sizeChange = this.sizeChange.bind(this)
        this.colorChange = this.colorChange.bind(this)
        this.painter = this.painter.bind(this)
        this.saveImage = this.saveImage.bind(this)
    }

    componentDidMount() {
        this.setState({isDrawer: null})
        let val = null
        this.painter()
        sessionStorage.setItem('size', 5)
    }

    componentDidUpdate() {
        if (this.state.current_drawer != null && this.state.current_drawer != this.props.param.current_drawer){
            this.setState({current_drawer: this.props.param.current_drawer})
        }
    }

    sizeChange(size) {
        sessionStorage.setItem('size', size.target.value)
    }

    colorChange(color, event) {
        sessionStorage.setItem('color', color.hex)
    }

    saveImage(){
        var canvas = document.querySelector('#board');
        //window.open(canvas.toDataURL("image/png"));
        let img = canvas.toDataURL("image/png");
        //let windowtab = window.open('about:blank');
        //windowtab.document.write("<img src = '" + img + "'/>");
        console.log("Saved image for user: " + this.props.param.user.email)
        socket.emit("saveImage", [img, this.props.param.user.email])
    }

    painter() {
        var canvas = document.querySelector('#board');
        var canvas_data = canvas.getContext('2d');
        
        var canvas_sizing = getComputedStyle(canvas);
        canvas.width = parseInt(canvas_sizing.getPropertyValue('width'), 10);
        canvas.height = parseInt(canvas_sizing.getPropertyValue('height'), 10);

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        canvas.addEventListener('mousemove', function(e) {
            canvas_data.lineJoin = 'round';
            canvas_data.lineCap = 'round';
            canvas_data.lineWidth = sessionStorage.size;
            canvas_data.strokeStyle = sessionStorage.getItem('color');
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
    }

    render() {
        return(
            <div className = 'boardContainer'>
                <canvas className = 'board' id = "board"></canvas>
                <div className = 'options'>
                    <div className = 'sizeContainer'>
                        <button className = 'pickerBTN' value = {5} onClick = {(value) => this.sizeChange(value)}>Thin</button>
                        <button className = 'pickerBTN' value = {10} onClick = {(value) => this.sizeChange(value)}>Normal</button>
                        <button className = 'pickerBTN' value = {15} onClick = {(value) => this.sizeChange(value)}>Thick</button>
                        <button className = 'pickerBTN' onClick = {() => this.saveImage()}>Save Image</button>
                    </div>
                </div>


            </div>
        )
    }
}

export default BoardDrawer