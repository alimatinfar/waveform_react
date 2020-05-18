import React from 'react';
import './App.css';
import axios from 'axios';
import WaveSurfer from 'wavesurfer_linear';
import upSample from './upSample';

class App extends React.Component {

  componentDidMount() {
    var buttons = {
      play: document.getElementById("btn-play"),
      pause: document.getElementById("btn-pause"),
      stop: document.getElementById("btn-stop")
    };

    let zooms = {
      one: document.getElementById("1x"),
      two: document.getElementById("2x"),
      three: document.getElementById("3x")
    }

    const exp = document.getElementById('exp')

    var Wavesurfer = WaveSurfer.create({
      container: '#audio-wavesurfer',
      waveColor: '#76767b',//#76767b
      barHeight: 1,
      scrollParent: true,
      cursorColor: '#457dd3',
      interpolate: true,
      normalize: false,
      height: 128,
      waveColor: "#999",
      progressColor: "#555",
      cursorColor: "#333",
      cursorWidth: 1,
      skipLength: 2,
      minPxPerSec: 20,
      fillParent: !0,
      scrollParent: !1,
      hideScrollbar: !1,
      normalize: !1,
      audioContext: null,
      dragSelection: !0,
      loopSelection: !0,
      audioRate: 1,
      interact: !0,
      splitChannels: !1,
      mediaContainer: null,
      mediaControls: !1,
      // renderer: "Canvas",
      // backend: "WebAudio",
      // mediaType: "audio",
      waveGain: null,
      waveHeightScale: 1,
      autoCenter: !0

    });
    console.log(Wavesurfer)
    // wavesur.constructor({
    //   hideScrollbar: false,
    // });
    // Handle Play button
    zooms.one.addEventListener("click", function () {

      Wavesurfer.zoom(50);
      Wavesurfer.setHeight(128);

    }, false);

    // Handle Play button
    zooms.two.addEventListener("click", function () {

      Wavesurfer.zoom(200);
      Wavesurfer.setHeight(300);

    }, false);

    // Handle Play button
    zooms.three.addEventListener("click", function () {

      Wavesurfer.zoom(400);
      Wavesurfer.setHeight(600);
    }, false);


    // Handle Play button
    buttons.play.addEventListener("click", function () {
      Wavesurfer.play();

      // Enable/Disable respectively buttons
      buttons.stop.disabled = false;
      buttons.pause.disabled = false;
      buttons.play.disabled = true;
    }, false);

    // Handle Pause button
    buttons.pause.addEventListener("click", function () {
      Wavesurfer.pause();

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
    }, false);


    // Handle Stop button
    buttons.stop.addEventListener("click", function () {
      Wavesurfer.stop();

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
      buttons.stop.disabled = true;
    }, false);


    // Add a listener to enable the play button once it's ready
    Wavesurfer.on('ready', function () {
      buttons.play.disabled = false;
    });

    // If you want a responsive mode (so when the user resizes the window)
    // the wavesurfer will be still playable
    window.addEventListener("resize", function () {
      // Get the current progress according to the cursor position
      var currentProgress = Wavesurfer.getCurrentTime() / Wavesurfer.getDuration();

      // Reset graph
      Wavesurfer.empty();
      Wavesurfer.drawBuffer();
      // Set original position
      Wavesurfer.seekTo(currentProgress);

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
      buttons.stop.disabled = false;
    }, false);

    axios.get('https://nabzgroup.com/api/v1/blog/s/8000', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'audio/wav'
      }
    })
      .then(function (response) {

        console.log(response.data)

        var codes = new Int16Array(response.data);

        function convert(n) {
          var v = n < 0 ? n * 32768 : n * 32767;       // convert in range [-32768, 32767]
          return parseInt(v); // clamp
        }

        let wavheader = codes.slice(0, 22);
        let orginalData = codes.slice(22)
        let upSampledData = upSample(orginalData, 2)

        let newUpSample = upSampledData.map(convert)
        let orginalUpSampledData = new Int16Array(newUpSample)
        let upSampled = new Int16Array([...wavheader, ...orginalUpSampledData])
        let upSampledBuffer = upSampled.buffer

        //  get data into txt file
        // let str = ''
        // for (let i of orginalUpSampledData) {
        //   str += i + '\n';
        // }
        // let a = document.createElement('a');
        // a.href = "data:application/octet-stream," + encodeURIComponent(str);
        // a.download = 'abc.txt';
        // a.click();

        Wavesurfer.loadArrayBuffer(upSampledBuffer)
      }).catch(function (error) {
        // handle error
        console.log(error);
      })

    //exportImage from waveform  
    exp.addEventListener("click", function () {
      var dataURL = Wavesurfer.exportImage('image/png', 1, 'dataURL');
      console.log(dataURL)
      document.getElementById('image').src = dataURL;
      var link = document.createElement('a');
      link.href = dataURL;
      link.download = 'Download.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, false);
  }

  render() {

    return (
      <div id="waveform">
        <div id="audio-wavesurfer"></div>

        <input type="button" id="btn-play" value="Play" disabled="disabled" />
        <input type="button" id="btn-pause" value="Pause" disabled="disabled" />
        <input type="button" id="btn-stop" value="Stop" disabled="disabled" />
        <div>
          <p>zoom</p>
          <input type="button" id="1x" value="1x" />
          <input type="button" id="2x" value="2x" />
          <input type="button" id="3x" value="4x" />
          <input type="button" id="exp" value="Export Image" />
        </div>

        <canvas id="myCanvas" width="240" height="297">
          Your browser does not support the HTML5 canvas tag.
          </canvas>

        <img id="image" />

      </div>
    )
  }
}

export default App;

