import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Layer, Line, Stage} from 'react-konva';

const TRAP_UPPER_HALF = 25;
const TRAP_LOWER_HALF = 70;

class Sundial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: 0, width: 0, trapHeight: 0, pressed: false, pressedX: 0, pressedY: 0, angle: 0};
    }

    componentDidMount() {
        this.updateDimensions();
        this.setState({
            angle: this.calculateAngle(),
        });
        document.title = 'Sundial';
        document.oncontextmenu = function () {
            return false;
        };
        this.intervalID = setInterval(
            () => this.updateAngle(),
            1000 * 60, // refresh angle every minute
        );
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    updateDimensions = () => {
        const h = window.innerHeight
        const w = window.innerWidth
        this.setState({
            height: h,
            width: w,
            trapHeight: Math.sqrt(h * h + w * w),
        });
    }

    calculateAngle() {
        const currentTime = new Date();
        const angle = (currentTime.getHours() % 12 + currentTime.getMinutes() / 60) * 360 / 12 + 180
        console.log(angle);
        return angle
    }

    updateAngle() {
        this.setState({
            angle: this.calculateAngle(),
        });
    }

    handleScreenPress = (e) => {
        const x = e.evt.pageX || (e.evt.touches && e.evt.touches[0].pageX) || 0;
        const y = e.evt.pageY || (e.evt.touches && e.evt.touches[0].pageY) || 0;
        this.setState({
            pressed: true,
            pressedX: x,
            pressedY: y,
        });
    };

    handleScreenRelease() {
        this.setState({
            pressed: false,
            pressedX: 0,
            pressedY: 0,
        });
    }

    drawPolygon(rotation) {
        const x = this.state.pressedX;
        const y = this.state.pressedY;
        const h = this.state.trapHeight;
        const rad = rotation * Math.PI / 180;
        const sine = Math.sin(rad);
        const cosine = Math.cos(rad);
        return (
            <Line
                points={[
                    x - TRAP_UPPER_HALF * cosine, y - TRAP_UPPER_HALF * sine,
                    x + TRAP_UPPER_HALF * cosine, y + TRAP_UPPER_HALF * sine,
                    (x - h * sine) + TRAP_LOWER_HALF * cosine, (y + h * cosine) + TRAP_LOWER_HALF * sine,
                    (x - h * sine) - TRAP_LOWER_HALF * cosine, (y + h * cosine) - TRAP_LOWER_HALF * sine,
                ]}
                fill="black"
                closed="true"
            />
        )
    }

    render() {
        const isPressed = this.state.pressed;
        return (
            <div className="fill-window">
                <Stage width={this.state.width}
                       height={this.state.height}
                       className="fill-window"
                       onTouchStart={this.handleScreenPress.bind(this)}
                       onTouchMove={isPressed && this.handleScreenPress.bind(this)}
                       onTouchEnd={this.handleScreenRelease.bind(this)}
                       onMouseDown={this.handleScreenPress.bind(this)}
                       onMouseMove={isPressed && this.handleScreenPress.bind(this)}
                       onMouseUp={this.handleScreenRelease.bind(this)}
                       onMouseLeave={this.handleScreenRelease.bind(this)}
                >
                    <Layer>
                        {this.state.pressed && this.drawPolygon(this.state.angle)}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

ReactDOM.render(<Sundial/>, document.getElementById('root')
);
