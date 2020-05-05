// https://github.com/ruebel/waveform-react
import React from 'react';
import Waveform from 'waveform-react';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {buffer: Buffer.from('abc')};
    }

    render() {
        return (
        <Waveform
            // Audio buffer
            buffer={this.state.buffer}
            // waveform height
            height={150}
            markerStyle={{
            // Position marker color
            color: '#fff',
            // Position marker width (in pixels)
            width: 4
            }}
            // Optionally handle user manually changing position (0 - 1)
            onPositionChange={pos => console.log(pos)}
            // Wave plot type (line or bar)
            plot="bar"
            // Marker position on waveform (0 - 1)
            position={0.5}
            // redraw waveform on window size change (default: true)
            responsive={false}
            // Show position marker
            showPosition={true}
            waveStyle={{
            // animate waveform on draw (default: true)
            animate: true,
            // waveform color
            color: '#000',
            // width of each rendered point (min: 1, max: 10)
            pointWidth: 1
            }}
            // waveform width
            width={900}
        />
        );
    }
}

export default MyComponent;