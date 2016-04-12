/**
* Contains the declaration for the {@link module:enyo-webos/Events} module.
* @module enyo-webos/Events
*/

var
	utils = require('enyo/utils'),
	platform = require('enyo/platform');

var
	Signals = require('enyo/Signals');

/**
* Events are exposed through the {@link module:enyo/Signals~Signals} kind by
* adding callback handlers.
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	Signals = require('enyo/Signals');
*
* module.exports = kind({
* 	name: 'App',
* 	components: [
* 		{kind: Signals, onwebOSRelaunch: 'relaunch'},
* 		// ...
* 	],
* 	relaunch: function(inSender, inEvent) {
* 		// Launch parameters json can be found within inEvent.detail
* 	}
* });
* ```
*/

/**
* @event module:enyo-webos/Events#onwebOSLaunch
* @see external:webOS-Event
* @public
*/

/**
* @event module:enyo-webos/Events#onwebOSRelaunch
* @see external:webOS-Event
* @public
*/

/**
* @event module:enyo-webos/Events#onwebOSLocaleChange
* @see external:webOS-Event
* @public
*/

/**
* Listens for webOS-specific events
*/
if (platform.webos || window.PalmSystem) {
	var wev = [
		'webOSLaunch',
		'webOSRelaunch',
		'webOSLocaleChange',
		'webOSThemeChange'
	];
	for (var i=0, e; (e=wev[i]); i++) {
		document.addEventListener(e, utils.bind(Signals, 'send', 'on' + e), false);
	}
}