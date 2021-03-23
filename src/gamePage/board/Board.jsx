import React from 'react';
import './style.css';
import { TwitterPicker } from 'react-color';
import { io } from 'socket.io-client';

class Board extends React.Component {

    timeout;
    socket = io.connect("http://localhost:5000")

    constructor(props) {
        super(props);

        this.socket.on("canvas-data", function(data){
            var image = new Image();
            var canvas = document.querySelector('#board');
            var ctx = canvas.getContext('2d');
            image.onload = function() {
                ctx.drawImage(image, 0, 0);
            };
            image.src = data;
        })

        this.sizeChange = this.sizeChange.bind(this)
        this.colorChange = this.colorChange.bind(this)
        this.draw_on_canvas = this.draw_on_canvas.bind(this)
        this.saveImage = this.saveImage.bind(this)
    }

    componentDidMount() {
        this.draw_on_canvas()
        sessionStorage.setItem('size', 5)
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
        window.open(canvas.toDataURL("image/png"));
    }

    draw_on_canvas() {
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        
        var sketch_style = getComputedStyle(canvas);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            ctx.lineWidth = sessionStorage.size;
            ctx.strokeStyle = sessionStorage.getItem('color');
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* Drawing on Paint App */
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;

        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (root.timeout != undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function(){
                var image = canvas.toDataURL("image/png");
                root.socket.emit("canvas-data", image);
            }, 500);
        };
    }

    render() {
        return(
            <div className = 'boardContainer'>
                <canvas className = 'board' id = "board"></canvas>
                <br/>
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

export default Board