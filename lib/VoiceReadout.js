module.exports = {
	/**
	* _enyo.readAlert_ is the API to use TTS for accessibility VoiceReadout.
	*
	* @private
	*/
	readAlert: function(s) {
		if (window.webOS !== undefined && window.webOS.voicereadout !== undefined) {
			window.webOS.voicereadout.readAlert(s);
		}
	}
};