import React from 'react';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import resampler from 'audio-resampler';
import axios from 'axios';
import wavfile from './sound/heart.wav'

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

    // Create an instance of wave surfer with its configuration
    var Spectrum = WaveSurfer.create({
      container: '#audio-spectrum',
      waveColor: '#76767b',//#76767b
      barHeight: 20,
      scrollParent: true,
      cursorColor: '#457dd3',
      progressColor: '#457dd3'
    });
    console.log(Spectrum)
    // Spectrum.constructor({
    //   hideScrollbar: false,
    // });
    // Handle Play button
    zooms.one.addEventListener("click", function () {

      Spectrum.zoom(50);
      Spectrum.setHeight(128);

    }, false);

    // Handle Play button
    zooms.two.addEventListener("click", function () {

      Spectrum.zoom(200);
      Spectrum.setHeight(300);

    }, false);

    // Handle Play button
    zooms.three.addEventListener("click", function () {

      Spectrum.zoom(400);
      Spectrum.setHeight(600);
    }, false);


    // Handle Play button
    buttons.play.addEventListener("click", function () {
      Spectrum.play();

      // Enable/Disable respectively buttons
      buttons.stop.disabled = false;
      buttons.pause.disabled = false;
      buttons.play.disabled = true;
    }, false);

    // Handle Pause button
    buttons.pause.addEventListener("click", function () {
      Spectrum.pause();

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
    }, false);


    // Handle Stop button
    buttons.stop.addEventListener("click", function () {
      Spectrum.stop();

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
      buttons.stop.disabled = true;
    }, false);


    // Add a listener to enable the play button once it's ready
    Spectrum.on('ready', function () {
      buttons.play.disabled = false;
    });

    // If you want a responsive mode (so when the user resizes the window)
    // the spectrum will be still playable
    window.addEventListener("resize", function () {
      // Get the current progress according to the cursor position
      var currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();

      // Reset graph
      Spectrum.empty();
      Spectrum.drawBuffer();
      // Set original position
      Spectrum.seekTo(currentProgress);

      // Enable/Disable respectively buttons
      buttons.pause.disabled = true;
      buttons.play.disabled = false;
      buttons.stop.disabled = false;
    }, false);


    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    axios.get('https://nabzgroup.com/api/v1/blog/s/8000', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'audio/wav'
      }
    })
      .then(function (response) {

        console.log(response)

        var codes = new Uint8Array(response.data);

        var bin = String.fromCharCode.apply(null, codes);
        // console.log(bin)
        var b64 = btoa(bin);

        const blob = b64toBlob(b64, "audio/x-wav", 256)
        // const buff = blob.arrayBuffer()
        // const sli = blob.slice(1, 4, "audio/x-wav");

        // var bufferPart = response.data.slice(40, 48);
        // var bufferView = new Uint32Array(bufferPart);
        // var samplerate = bufferView[0];
        // console.log(samplerate)
        Spectrum.loadBlob(blob)
        // Spectrum.loadBlob(blob);
      }).catch(function (error) {
        // handle error
        console.log(error);
      })
    
    // Spectrum.load(wavfile)
    exp.addEventListener("click", function () {
      var dataURL = Spectrum.exportImage('image/png', 1, 'dataURL');
      console.log(dataURL)
      document.getElementById('image').src = dataURL;
      var link = document.createElement('a');
      link.href = dataURL;
      link.download = 'Download.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, false);



    // Spectrum.load('https://nabzgroup.com/api/v1/blog/s/8000')
  }

  render() {
    return (
      <div id="waveform">
        <div id="audio-spectrum"></div>

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
