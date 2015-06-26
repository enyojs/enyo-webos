require('../webOS/webOS');

var
	options = require('enyo/options');

module.exports = {
	/**
	* Read alert message.
	*
	* @public
	*/
	readAlert: function(s) {
		if (options.accessibility && window.webOS && window.webOS.voicereadout) {
			window.webOS.voicereadout.readAlert(s);
		}
	}
};