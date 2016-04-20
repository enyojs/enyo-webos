require('../webOS/webOS');

/**
* Contains the declaration for the {@link module:enyo-webos/VoiceReadout} module.
* @module enyo-webos/VoiceReadout
*/

var
	options = require('enyo/options');

module.exports = {
	/**
	* Reads alert message.
	* @param {string} s - String to voice readout.
	* @param {boolean} c - Clear optoin for TTS. If true it will cut off previous reading. Valid for TV only
	* @public
	*/
	readAlert: function(s, c) {
		if (options.accessibility && window.webOS.voicereadout) {
			window.webOS.voicereadout.readAlert(s, c);
		}
	}
};