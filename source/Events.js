(function (enyo, scope) {
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
	if (enyo.platform.webos || window.PalmSystem) {
		var wev = [
			'webOSLaunch',
			'webOSRelaunch',
			'webOSLocaleChange'
		];
		for (var i=0, e; (e=wev[i]); i++) {
			document.addEventListener(e, enyo.bind(enyo.Signals, 'send', 'on' + e), false);
		}
	}

})(enyo, this);