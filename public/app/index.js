import io from 'socket.io-client';


const NUM_CHUNKS = 5;

class Main {

	_mediaSource = null;

	_mediaSourceBuffer = null;

	_video = null;

	_chunkIndex = 0;

	_data = null;

	constructor() {
		this._init();
	}


	_init() {
		this._socket = io('http://localhost:3000');
		this._socket.on('connect', ::this._onSocketConnect);
		this._socket.on('receive video data', ::this._onReceiveVideoData);
	}


	_onSocketConnect() {
		this._socket.emit('get video data', ::this._onSocketGetVideoData);
	}


	_onSocketGetVideoData() {
		
	}

	_onReceiveVideoData(data) {
		// const uint8array = new Uint8Array(data.buffer);

		this._data = data.buffer;

		this._video = document.querySelector('video'); 

		this._mediaSource = new MediaSource();

		const sourceURL = window.URL.createObjectURL(this._mediaSource);

		this._video.src = sourceURL;

		this._mediaSource.addEventListener('sourceopen', ::this._onSourceOpen, false);
	}


	_onSourceOpen(event) {
		this._mediaSourceBuffer = this._mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

		console.log('mediaSource readyState: ' + this._mediaSource.readyState);

		this._mediaSourceBuffer.appendBuffer(this._data);

		if (this._video.paused) {
			this._video.play(); // Start playing after 1st chunk is
		}

		this._mediaSourceBuffer.addEventListener('updateend', () => {
			this._mediaSource.endOfStream();
		});
	}



}

new Main();