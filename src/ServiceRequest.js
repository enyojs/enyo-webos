require('enyo-webos');

/**
* Contains the declaration for the {@link module:enyo-webos/ServiceRequest~ServiceRequest} kind.
* @module enyo-webos/ServiceRequest
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils');

var
	Async = require('enyo/Async');

/**
* An extension of the {@link module:enyo/Async~Async} object designed for webOS
* service requests.
*
* @class ServiceRequest
* @extends module:enyo/Async~Async
* @public
*/
module.exports = kind(
	/** @lends module:enyo-webos/ServiceRequest~ServiceRequest.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.ServiceRequest',

	/**
	* @private
	*/
	kind: Async,

	/**
	* @private
	*/
	published: {

		/**
		* The Luna service URI.  Starts with `luna://`.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		service: '',

		/**
		* The service method to call.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		method: '',

		/**
		* Whether or not to subscribe to the service.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		subscribe: false,

		/**
		* Whether or not the request should resubscribe when an error is returned.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		resubscribe: false
	},

	/**
	* Executes the service request with an optional object containing parameters
	* to be sent.
	*
	* @param {Object} [params]
	* @return {Object}
	* @public
	*/
	go: function(params) {
		if(!window.PalmServiceBridge) {
			this.fail({
				errorCode: -1,
				errorText: 'Invalid device for Palm services. PalmServiceBridge not found.'
			});
			return undefined;
		}
		this.startTimer();
		this.params = params || {};
		this.request = navigator.service.request(this.service, {
			method: this.method,
			parameters: this.params,
			subscribe: this.subscribe,
			resubscribe: this.resubscribe,
			onSuccess: utils.bind(this, this.serviceSuccess),
			onFailure: utils.bind(this, this.serviceFailure)
		});
		return this.request;
	},

	/**
	* Cancels the request/subscription.
	*
	* @public
	*/
	cancel: function() {
		if(this.request) {
			this.request.cancel();
			this.request = undefined;
		}
	},

	/**
	* @private
	*/
	serviceSuccess: function(response) {
		var successCallback;
		if(this.responders.length>0) {
			successCallback = this.responders[0];
		}
		this.respond(response);
		if(this.subscribe && successCallback) {
			this.response(successCallback);
		}
	},

	/**
	* @private
	*/
	serviceFailure: function(error) {
		var failureCallback;
		if(this.errorHandlers.length>0) {
			failureCallback = this.errorHandlers[0];
		}
		this.fail(error);
		if(this.resubscribe && this.subscribe) {
			if(failureCallback) {
				this.error(failureCallback);
			}
		}
	},
	
	/**
	* @private
	*/
	timeoutComplete: function () {
		this.timedout = true;
		this.fail({
			errorCode: -2,
			errorText: "Service request timeout"
		});
		this.cancel();
	}
});