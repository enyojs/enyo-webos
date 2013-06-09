/**
	An extension of the <a href="#enyo.Async">enyo.Async</a> object designed for webOS service requests.
*/

enyo.kind({
	name: "enyo.ServiceRequest",
	kind: enyo.Async,
	//* @public
	published: {
		//* Palm service URI.  Starts with palm://
		service:"",
		//* Service method you want to call
		method:"",
		//* Whether or not the request to subscribe to the service
		subscribe: false,
		//* Whether or not the request should resubscribe when an error is returned
		resubscribe: false
	},
	/**
		Properties passed in the inParams object will be mixed into the object itself,
		so you can optionally set properties like _"service"_ and _"method"_ inline in the
		constructor rather than using the setters individually.
	*/
	constructor: function(inParams) {
		enyo.mixin(this, inParams);
		this.inherited(arguments);
	},
	//* Execute the service request with an optional object for parameters to be sent.
	go: function(inParams) {
		if(!PalmServiceBridge) {
			this.fail({
				errorCode: -1,
				errorText: "Invalid device for Palm services. PalmServiceBridge not found."
			});
			return undefined;
		}
		this.params = inParams || {};
		var self = this;
		this.request = navigator.service.Request(this.service, {
			method: this.method,
			parameters: this.params,
			subscribe: this.subscribe,
			resubscribe: this.resubscribe,
			onSuccess: enyo.bind(this, this.serviceSuccess),
			onFailure: enyo.bind(this, this.serviceFailure)
		});
		return this.request;
	},
	//* Cancel the request/subscription.
	cancel: function() {
		if(this.request) {
			this.request.cancel();
			this.request = undefined;
		}
	},
	//* @protected
	serviceSuccess: function(inResponse) {
		var successCallback = undefined;
		if(this.responders.length>0) {
			successCallback = this.responders[0];
		}
		this.respond(inResponse);
		if(this.subscribe && successCallback) {
			this.response(successCallback);
		}
	},
	serviceFailure: function(inError) {
		var failureCallback = undefined;
		if(this.errorHandlers.length>0) {
			failureCallback = this.errorHandlers[0];
		}
		this.fail(inError);
		if(this.resubscribe && this.subscribe) {
			if(failureCallback) {
				this.error(failureCallback);
			}
		}
	}
});