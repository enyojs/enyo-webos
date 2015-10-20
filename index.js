var
	platform = require('enyo/platform'),
	logger = require('enyo/logger'),
	utils = require('enyo/utils'),
	dispatcher = require('enyo/dispatcher');

var
	Signals = require('enyo/Signals');

require('./src/Events');
require('./webOS/webOS');
require('./src/AppInfo');
if (!global.cordova) {
	// if Cordova not used, add signal generation for the "menubutton" event used
	// in webOS.js for legacy webOS and Open webOS for the appmenu
	document.addEventListener('menubutton', utils.bind(Signals, 'send', 'onmenubutton'), false);
}
dispatcher.listen(document, 'webOSMouse');
dispatcher.listen(document, 'keyboardStateChange');

exports.version = '2.6.0-pre.18.1';
