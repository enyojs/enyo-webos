var
	utils = require('enyo/utils'),
	platform = require('enyo/platform');

var
	Signals = require('enyo/Signals'),
	Spotlight = require('spotlight');

/**
* Events are exposed through the {@link enyo.Signals} kind by adding callback handlers.
*
* ```
* enyo.kind({
* 	name: 'App',
* 	components: [
* 		{kind: 'Signals', onwebOSRelaunch: 'relaunch'},
* 		// ...
* 	],
* 	relaunch: function(inSender, inEvent) {
* 		// Launch parameters json can be found within inEvent.detail
* 	}
* });
* ```
* @external webOS-Event
*/

/**
* @event event:onwebOSLaunch
* @see external:webOS-Event
* @public
*/

/**
* @event event:onwebOSRelaunch
* @see external:webOS-Event
* @public
*/

/**
* @event event:onwebOSLocaleChange
* @see external:webOS-Event
* @public
*/

/**
* Listens for webOS specific events
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
	document.addEventListener('webOSMouse', utils.bind(Spotlight, 'onwebOSMouse'), false);
}
