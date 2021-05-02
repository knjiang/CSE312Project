import React from 'react';
import './style.css';
import { TwitterPicker } from 'react-color';
import { Socket as socket } from '../../pages/Socket'

class BoardDrawer extends React.Component {

    timeout;

    constructor(props) {
        super(props);

        this.state = {
            isDrawer: null,
            current_drawer: null
        }

        this.sizeChange = this.sizeChange.bind(this)
        this.colorChange = this.colorChange.bind(this)
        this.painter = this.painter.bind(this)
        this.saveImage = this.saveImage.bind(this)
    }

    componentDidMount() {
        this.setState({isDrawer: null, current_drawer: null})
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
        console.log(size.target.value, sessionStorage.getItem('size'))
    }

    colorChange(color, event) {
        sessionStorage.setItem('color', color.hex)
        console.log(sessionStorage.getItem('color'))
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

        var orginSocket = this;

        function onPaint() {
            canvas_data.beginPath();
            canvas_data.moveTo(last_mouse.x, last_mouse.y);
            canvas_data.lineTo(mouse.x, mouse.y);
            canvas_data.closePath();
            canvas_data.stroke();

            if (orginSocket.timeout != undefined) clearTimeout(orginSocket.timeout);
            orginSocket.timeout = setTimeout(function(){
                var image = canvas.toDataURL("image/png");
                socket.emit("emit_canvas", [image, orginSocket.state.current_drawer]);
            }, 100);
            console.log("Emitting canvas data")
        };

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);
    }

    render() {
        return(
            <div className = 'boardContainer'>
                <canvas className = 'board' id = "board"></canvas>
                <div className = 'options'>
                    <div className = 'sizeContainer'>
                        <button value = {5} onClick = {(value) => this.sizeChange(value)}>Thin</button>
                        <button value = {10} onClick = {(value) => this.sizeChange(value)}>Normal</button>
                        <button value = {15} onClick = {(value) => this.sizeChange(value)}>Thick</button>
                        <button onClick = {() => this.saveImage()}>SAVE</button>
                    </div>
                    <div className = 'colorContainer'>
                        <TwitterPicker style = {{textAlign: 'center'}}
                            width = {'20vw'}
                            triangle = {'hide'}
                            colors = {['#000000', '#FF0000', '#00D084', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']}
                            onChangeComplete = { this.colorChange }
                        />
                    </div>
                </div>


            </div>
        )
    }
}

export default BoardDrawer