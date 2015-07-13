var
	platform = require('enyo/platform'),
	logger = require('enyo/logger'),
	utils = require('enyo/utils');

var
	Signals = require('enyo/Signals');

require('./lib/Events');
require('./webOS/webOS');
require('./lib/AppInfo');
if (!global.cordova) {
	// if Cordova not used, add signal generation for the "menubutton" event used
	// in webOS.js for legacy webOS and Open webOS for the appmenu
	document.addEventListener('menubutton', utils.bind(Signals, 'send', 'onmenubutton'), false);
}

exports.version = '2.6.0-pre.9.dev';