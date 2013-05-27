/**
	_enyo.PalmService_ is a component similar to <a href="#enyo.WebService">enyo.WebService</a>, but for 
	Palm service requests.
	
	Internally it generates new <a href="#enyo.ServiceRequest">enyo.ServiceRequest</a> for each `send()`
	call, keeping  track of each request made and sending out resulting events as they occur. This
	allows for multiple concurrent request calls to be sent without any potential overlap or gc issues.
*/

enyo.kind({
	name: "enyo.PalmService",
	kind: enyo.Component,
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
	events: {
		/**
			Fires when a response is received. Event data contains the returned response.
			The _originator_ property will contain the calling <a href="#enyo.ServiceRequest">enyo.ServiceRequest</a>.
		*/
		onResponse: "",
		/**
			Fires when an error is received. Event data contains the error data.
			The _originator_ property will contain the calling <a href="#enyo.ServiceRequest">enyo.ServiceRequest</a>.
		*/
		onError: "",
		/**
			Fires when a service request is complete (regardless of success or failure).
			Event data contains the response data and/or error data.
			The _originator_ property will contain the calling <a href="#enyo.ServiceRequest">enyo.ServiceRequest</a>.
		*/
		onComplete: ""
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.activeRequests = [];
		this.activeSubscriptionRequests = [];
	},	
	//* @public
	/**
		Sends a webOS service request with the passed-in parameters, returning the associated
		<a href="#enyo.ServiceRequest">enyo.ServiceRequest</a> instance.
	*/
	send: function(inParams) {
		inParams = inParams || {};
		var self = this;
		var request = navigator.service.Request(this.service, {
			method: this.method,
			parameters:inParams,
			subscribe: this.subscribe,
			resubscribe: this.resubscribe,
			onSuccess: function(inResponse) {
				inResponse.originator = request;
				self.doResponse(inResponse);
				self.requestComplete(request, inResponse);
			},
			onFailure: function(inError) {
				inError.originator = request;
				self.doError(inError);
				self.requestComplete(request, inResponse);
			}
		});
		request.originalCancel = request.cancel;
		request.cancel = enyo.bind(this, "cancel", request);
		if(this.subscribe) {
			this.activeSubscriptionRequests.push(request);
		} else {
			this.activeRequests.push(request);
		}
		return request;
	},
	//* Cancels a given request.  The equivalent of `inRequest.cancel()`
	cancel: function(inRequest) {
		this.removeRequest(inRequest);
		inRequest.originalCancel();
	},
	//* @protected
	removeRequest: function(inRequest) {
		var i = -1;
		i = this.activeRequests.indexOf(inRequest);
		if (i !== -1) {
			this.activeRequests.splice(i, 1);
		} else {
			i = this.activeSubscriptionRequests.indexOf(inRequest);
			if (i !== -1) {
				this.activeSubscriptionRequests.splice(i, 1);
			}
		}
	},
	requestComplete: function(inRequest, inData) {
		var i = -1;
		i = this.activeRequests.indexOf(inRequest);
		if (i !== -1) {
			this.activeRequests.splice(i, 1);
		}
		this.doComplete(inData);
	},
	destroy: function() {
		var i;
		for(i=0; i<this.activeRequests.length; i++) {
			this.activeRequests[i].originalCancel();
		}
		delete this.activeRequests;
		
		for(i=0; i<this.activeSubscriptionRequests.length; i++) {
			this.activeSubscriptionRequests[i].originalCancel();
		}
		delete this.activeSubscriptionRequests;
		this.inherited(arguments);
	}
});
