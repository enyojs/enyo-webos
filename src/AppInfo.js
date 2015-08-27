/**
* Loads the application's appInfo.json file and configures Enyo
* 
* @module enyo-webos/AppInfo
* @private
*/

var
	EnyoHistory = require('enyo/History');

global.webOS.fetchAppInfo(function (appInfo) {
	if (appInfo) {
		EnyoHistory.set('updateHistory', !appInfo.disableBackHistoryAPI);
	}
});