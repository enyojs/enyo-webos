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
	*
	* @public
	*/
	readAlert: function(s) {
		if (options.accessibility && window.webOS.voicereadout) {
			window.webOS.voicereadout.readAlert(s);
		}
	}
};