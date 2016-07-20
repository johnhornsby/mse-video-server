
import 'babel-polyfill';
import io from 'socket.io-client';
import co from 'co';


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
		this._video = document.querySelector('video');

		this._bind();

		const self = this;

		co(function *() {

			// init socket and mediaSource in parallel
			yield [ self._initSocketConnection(), self._initMediaSource() ];

		}).then(self._onSocketGetVideoData, self._onError);
	}


	_bind() {
		this._onReceiveVideoData = ::this._onReceiveVideoData;
		this._onSocketGetVideoData = ::this._onSocketGetVideoData;
	}


	_initSocketConnection() {
		return new Promise((resolve, reject) =>  {
			this._socket = io('http://localhost:3000');
			this._socket.on('connect', () => {

				console.log('socket ready');

				resolve();
			});
		});
	}


	_initMediaSource() {
		return new Promise((resolve, reject) => {
			const mediaSource = this._mediaSource = new MediaSource();

			mediaSource.addEventListener('sourceopen', () => {
				
				this._mediaSourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

				console.log('mediaSource readyState: ' + mediaSource.readyState);

				resolve(mediaSource);
			});

			this._video.src = window.URL.createObjectURL(mediaSource);
		});
	}


	_onSocketGetVideoData() {
		this._socket.emit('get video data', this._onReceiveVideoData);
	}


	_onReceiveVideoData(data) {
		const arrayBuffer = data.buffer;

		this._mediaSourceBuffer.appendBuffer(arrayBuffer);

		if (this._video.paused) {
			this._video.play(); // Start playing if paused
		}

		this._mediaSourceBuffer.addEventListener('updateend', () => {
			this._mediaSource.endOfStream();
		});
	}


	_onError(err) {
		console.error(err.stack);
	}

}

new Main();