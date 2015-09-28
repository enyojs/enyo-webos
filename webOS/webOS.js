!function(){window.webOS=window.webOS||{}}(),function(){if(webOS.platform={},window.PalmSystem)if(navigator.userAgent.indexOf("SmartWatch")>-1)webOS.platform.watch=!0;else if(navigator.userAgent.indexOf("SmartTV")>-1||navigator.userAgent.indexOf("Large Screen")>-1)webOS.platform.tv=!0;else try{var e=JSON.parse(PalmSystem.deviceInfo||"{}");if(e.platformVersionMajor&&e.platformVersionMinor){var t=parseInt(e.platformVersionMajor),i=parseInt(e.platformVersionMinor);3>t||3==t&&0>=i?webOS.platform.legacy=!0:webOS.platform.open=!0}}catch(o){webOS.platform.open=!0}else webOS.platform.unknown=!0}(),function(){webOS.fetchAppId=function(){return window.PalmSystem&&PalmSystem.identifier?PalmSystem.identifier.split(" ")[0]:void 0},webOS.fetchAppInfo=function(e,t){if(webOS.appInfo)e&&e(webOS.appInfo);else{var i=this.fetchAppId(),o=[this.fetchAppRootPath()+"appinfo.json","appinfo.json","file:///media/cryptofs/apps/usr/palm/applications/"+i+"/appinfo.json","file:///usr/palm/applications/"+i+"/appinfo.json"],s=o[1].indexOf(i);s>-1&&o.splice(1,0,o[1].substring(0,s)+i+"/appinfo.json"),t&&o.unshift(t);var n=function(e){if(0==o.length)e({status:404});else{var t=o.shift(),i=new XMLHttpRequest;i.onreadystatechange=function(){4==i.readyState&&(i.status>=200&&i.status<300||0===i.status?e(void 0,i.responseText):n(e))};try{i.open("GET",t,!0),i.send(null)}catch(s){n(e)}}};n(function(t,o){if(!t&&o)try{webOS.appInfo=JSON.parse(o),e&&e(webOS.appInfo)}catch(s){console.error("Unable to parse appinfo.json file for "+i),e&&e()}else e&&e()})}},webOS.fetchAppRootPath=function(){var e=window.location.href;if("baseURI"in window.document)e=window.document.baseURI;else{var t=window.document.getElementsByTagName("base");t.length>0&&(e=t[0].href)}var i=e.match(new RegExp(".*://[^#]*/"));return i?i[0]:""}}(),function(){webOS.deviceInfo=function(e){if(this.device)e(this.device);else{this.device={};try{var t=JSON.parse(PalmSystem.deviceInfo);this.device.modelName=t.modelName,this.device.modelNameAscii=t.modelNameAscii,this.device.version=t.platformVersion,this.device.versionMajor=t.platformVersionMajor,this.device.versionMinor=t.platformVersionMinor,this.device.versionDot=t.platformVersionDot,this.device.sdkVersion=t.platformVersion,this.device.screenWidth=t.screenWidth,this.device.screenHeight=t.screenHeight}catch(i){this.device.modelName=this.device.modelNameAscii="webOS Device"}this.device.screenHeight=this.device.screenHeight||screen.height,this.device.screenWidth=this.device.screenWidth||screen.width;var o=this;webOS.platform.tv?webOS.service.request("luna://com.webos.service.tv.systemproperty",{method:"getSystemInfo",parameters:{keys:["firmwareVersion","modelName","sdkVersion","UHD"]},onSuccess:function(t){if(o.device.modelName=t.modelName||o.device.modelName,o.device.modelNameAscii=t.modelName||o.device.modelNameAscii,o.device.sdkVersion=t.sdkVersion||o.device.sdkVersion,o.device.uhd="true"===t.UHD,t.firmwareVersion&&"0.0.0"!==t.firmwareVersion||(t.firmwareVersion=t.sdkVersion),t.firmwareVersion){o.device.version=t.firmwareVersion;for(var i=o.device.version.split("."),s=["versionMajor","versionMinor","versionDot"],n=0;n<s.length;n++)try{o.device[s[n]]=parseInt(i[n])}catch(r){o.device[s[n]]=i[n]}}e(o.device)},onFailure:function(t){e(o.device)}}):(webOS.platform.watch&&(this.device.modelName=this.device.modelNameAscii="webOS Watch"),e(this.device))}}}(),function(){webOS.feedback={play:function(e){if(webOS&&webOS.platform&&webOS.platform.watch){var t={name:e||"touch",sink:"pfeedback"};if(!window.PalmServiceBridge)return;webOS.service.request("luna://com.palm.audio/systemsounds",{method:"playFeedback",parameters:t,subscribe:!1,resubscribe:!1})}}}}(),function(){webOS.keyboard={isShowing:function(){return PalmSystem&&PalmSystem.isKeyboardVisible&&PalmSystem.isKeyboardVisible()}}}(),function(){webOS.notification={showToast:function(e,t){var i=e.message||"",o=e.icon||"",s=webOS.fetchAppId(),n=e.appId||s,r=e.appParams||{},a=e.target,c=e.noaction,l=e.stale||!1,u=e.soundClass||"",m=e.soundFile||"",d=e.soundDurationMs||"";if(webOS.platform.legacy||webOS.platform.open){var f=(e.response||{banner:!0},PalmSystem.addBannerMessage(i,JSON.stringify(r),o,u,m,d));t&&t(f)}else{i.length>60&&console.warn("Toast notification message is longer than recommended. May not display as intended");var p={sourceId:s,message:i,stale:l,noaction:c};o&&o.length>0&&(p.iconUrl=o),c||(a?p.onclick={target:a}:p.onclick={appId:n,params:r}),this.showToastRequest=webOS.service.request("palm://com.webos.notification",{method:"createToast",parameters:p,onSuccess:function(e){t&&t(e.toastId)},onFailure:function(e){console.error("Failed to create toast: "+JSON.stringify(e)),t&&t()}})}},removeToast:function(e){if(webOS.platform.legacy||webOS.platform.open)try{PalmSystem.removeBannerMessage(e)}catch(t){console.warn(t),PalmSystem.clearBannerMessage()}else this.removeToastRequest=webOS.service.request("palm://com.webos.notification",{method:"closeToast",parameters:{toastId:e}})},supportsDashboard:function(){return webOS.platform.legacy||webOS.platform.open},showDashboard:function(e,t){if(webOS.platform.legacy||webOS.platform.open){var i=window.open(e,"_blank",'attributes={"window":"dashboard"}');return t&&i.document.write(t),i.PalmSystem&&i.PalmSystem.stageReady(),i}console.warn("Dashboards are not supported on this version of webOS.")}}}(),function(){var e=0,t=1,i=2,o=3,s=4,n=5,r=6,a=7,c=function(e){return!!e&&"object"==typeof e&&"[object Array]"!==Object.prototype.toString.call(e)},l=function(e,t,i,s){window.PalmSystem&&(i&&!c(i)&&(e=o,i={msgid:t},t="MISMATCHED_FMT",s=null,console.warn("webOSLog called with invalid format: keyVals must be an object")),t||e==a||console.warn("webOSLog called with invalid format: messageId was empty"),i&&(i=JSON.stringify(i)),window.PalmSystem.PmLogString?e==a?window.PalmSystem.PmLogString(e,null,null,s):window.PalmSystem.PmLogString(e,t,i,s):console.error("Unable to send log; PmLogString not found in this version of PalmSystem"))};webOS.emergency=function(t,i,o){l(e,t,i,o)},webOS.alert=function(e,i,o){l(t,e,i,o)},webOS.critical=function(e,t,o){l(i,e,t,o)},webOS.error=function(e,t,i){l(o,e,t,i)},webOS.warning=function(e,t,i){l(s,e,t,i)},webOS.notice=function(e,t,i){l(n,e,t,i)},webOS.info=function(e,t,i){l(r,e,t,i)},webOS.debug=function(e){l(a,"","",e)}}(),function(){function e(e,t){this.uri=e,t=t||{},t.method&&("/"!=this.uri.charAt(this.uri.length-1)&&(this.uri+="/"),this.uri+=t.method),"function"==typeof t.onSuccess&&(this.onSuccess=t.onSuccess),"function"==typeof t.onFailure&&(this.onFailure=t.onFailure),"function"==typeof t.onComplete&&(this.onComplete=t.onComplete),this.params="object"==typeof t.parameters?t.parameters:{},this.subscribe=t.subscribe||!1,this.subscribe&&(this.params.subscribe=t.subscribe),this.params.subscribe&&(this.subscribe=this.params.subscribe),this.resubscribe=t.resubscribe||!1,this.send()}e.prototype.send=function(){if(!window.PalmServiceBridge)return this.onFailure&&this.onFailure({errorCode:-1,errorText:"PalmServiceBridge not found.",returnValue:!1}),this.onComplete&&this.onComplete({errorCode:-1,errorText:"PalmServiceBridge not found.",returnValue:!1}),void console.error("PalmServiceBridge not found.");this.bridge=new PalmServiceBridge;var t=this;this.bridge.onservicecallback=this.callback=function(i){var o;if(!t.cancelled){try{o=JSON.parse(i)}catch(s){o={errorCode:-1,errorText:i,returnValue:!1}}(o.errorCode||0==o.returnValue)&&t.onFailure?(t.onFailure(o),t.resubscribe&&t.subscribe&&(t.delayID=setTimeout(function(){t.send()},e.resubscribeDelay))):t.onSuccess&&t.onSuccess(o),t.onComplete&&t.onComplete(o),t.subscribe||t.cancel()}},this.bridge.call(this.uri,JSON.stringify(this.params))},e.prototype.cancel=function(){this.cancelled=!0,this.resubscribeJob&&clearTimeout(this.delayID),this.bridge&&(this.bridge.cancel(),this.bridge=void 0)},e.prototype.toString=function(){return"[LS2Request]"},e.resubscribeDelay=1e4,webOS.service={request:function(t,i){return new e(t,i)},systemPrefix:"com.webos.",protocol:"luna://"},navigator.service={request:webOS.service.request},navigator.service.Request=navigator.service.request}(),function(){webOS.libVersion="0.1.0"}(),function(){webOS.voicereadout={readAlert:function(e){if(webOS&&webOS.platform&&webOS.platform.watch){var t,i,o=function(e){webOS.service.request("luna://com.webos.settingsservice",{method:"getSystemSettings",parameters:{category:"VoiceReadOut"},onSuccess:function(t){t&&t.settings.talkbackEnable&&e()},onFailure:function(e){console.error("Failed to get system VoiceReadOut settings: "+JSON.stringify(e))}})},s=function(e){webOS.service.request("luna://com.webos.settingsservice",{method:"getSystemSettings",parameters:{keys:["localeInfo"]},onSuccess:function(i){t=i.settings.localeInfo.locales.TTS,e()},onFailure:function(e){console.error("Failed to get system localeInfo settings: "+JSON.stringify(e))}})},n=function(e){webOS.service.request("luna://com.webos.settingsservice",{method:"getSystemSettings",parameters:{category:"option",key:"ttsSpeechRate"},onSuccess:function(t){i=Number(t.settings.ttsSpeechRate),e()},onFailure:function(e){console.error("Failed to get system speechRate settings: "+JSON.stringify(e))}})},r=function(){webOS.service.request("luna://com.lge.service.tts",{method:"speak",parameters:{locale:t,text:e,speechRate:i}})};o(function(){s(function(){n(r)})})}else if(webOS&&webOS.platform&&webOS.platform.tv){var a=function(e){webOS.service.request("luna://com.webos.settingsservice",{method:"getSystemSettings",parameters:{keys:["audioGuidance"],category:"option"},onSuccess:function(t){t&&"on"===t.settings.audioGuidance&&e()},onFailure:function(e){console.error("Failed to get system AudioGuidance settings: "+JSON.stringify(e))}})},r=function(){webOS.service.request("luna://com.webos.service.tts",{method:"speak",parameters:{text:e,clear:!0},onFailure:function(e){console.error("Failed to readAlertMessage: "+JSON.stringify(e))}})};a(r)}else console.warn("Platform doesn't support TTS api.")}}}();