class Main {



	_mediaSource = null;

	_mediaSourceBuffer = null;

	_video = null;

	constructor() {
		this._init();
	}


	_init() {

		this._video = document.querySelector('video'); 

		this._mediaSource = new MediaSource();

		const sourceURL = window.URL.createObjectURL(this._mediaSource);

		this._video.src = sourceURL;

		this._mediaSource.addEventListener('sourceopen', ::this._onSourceOpen, false);
	}


	_onSourceOpen(event) {
		this._mediaSourceBuffer = this._mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

		console.log('mediaSource readyState: ' + this._mediaSource.readyState);

		this._loadVideo('http://localhost:8080/public/test.webm', ::this._chunkVideo);
	}


	_loadVideo(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.send();

		xhr.onload = function(e) {
			if (xhr.status != 200) {
				alert("Unexpected status code " + xhr.status + " for " + url);
				return false;
			}
			callback(new Uint8Array(xhr.response));
		};
	}


	_chunkVideo(uInt8Array) {
		var NUM_CHUNKS = 5;

		var file = new Blob([uInt8Array], {type: 'video/webm'});
		var chunkSize = Math.ceil(file.size / NUM_CHUNKS);

		console.log('num chunks:' + NUM_CHUNKS);
		console.log('chunkSize:' + chunkSize + ', totalSize:' + file.size);

		// Slice the video into NUM_CHUNKS and append each to the media element.
		var i = 0;

		var self = this;

		(function readChunk_(i) {
			var reader = new FileReader();

			// Reads aren't guaranteed to finish in the same order they're started in,
			// so we need to read + append the next chunk after the previous reader
			// is done (onload is fired).
			reader.onload = function(e) {
				self._mediaSourceBuffer.appendBuffer(new Uint8Array(e.target.result));
				console.log('appending chunk:' + i);
				if (i == NUM_CHUNKS - 1) {
					self._mediaSource.endOfStream();
				} else {
					if (self._video.paused) {
						self._video.play(); // Start playing after 1st chunk is appended.
					}
					readChunk_(++i);
				}
			};

			var startByte = chunkSize * i;
			var chunk = file.slice(startByte, startByte + chunkSize);

			reader.readAsArrayBuffer(chunk);
		})(i);  // Start the recursive call by self calling.

	}
}

new Main();