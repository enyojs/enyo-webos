(function() {
	if (enyo.platform.webos || window.PalmSystem) {
		var wev = [
			"webOSLaunch",
			"webOSRelaunch"
		];
		for (var i=0, e; (e=wev[i]); i++) {
			document.addEventListener(e, enyo.bind(enyo.Signals, "send", "on" + e), false);
		}
	}
})();