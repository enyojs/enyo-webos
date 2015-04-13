var
	platform = require('enyo/platform'),
	logger = require('enyo/logger'),
	utils = require('enyo/utils');

var
	Signals = require('enyo/Signals');

if (platform.webos || global.PalmSystem) {
	// doesn't keep it from being loaded into build but does keep it from executing the module
	require('./assets/webOSjs-0.1.0/webOS');
	if (!global.cordova) {
		// if Cordova not used, add signal generation for the "menubutton" event used
		// in webOS.js for legacy webOS and Open webOS for the appmenu
		document.addEventListener('menubutton', utils.bind(Signals, 'send', 'onmenubutton'), false);
	}
} else logger.warn('webOS.js not loaded: Current platform not supported.');

exports.version = '2.6.0-pre.5.dev';