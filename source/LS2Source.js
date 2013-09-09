
enyo.kind({
	name: "enyo.ServiceModel",
	kind: "enyo.Model",
	defaultSource:"service",
	//* Palm service URI.  Starts with palm://
	service: "",
	//* Service method you want to call
	method: "",
	//* Whether or not the request to subscribe to the service
	subscribe: false,
	//* Whether or not the request should resubscribe when an error is returned
	resubscribe: false,
	//* If true, <a href="#enyo.MockRequest">enyo.MockRequest</a> will be used in place of enyo.ServiceRequest
	mock: false,
	//* Optionally specify the json file to read for mock results, rather than autogenerating the filepath
	mockFile: undefined,
	//* Outputs the actual data in a payload form
	raw: function() {
		return {
			service:this.service,
			method:this.method,
			subscribe:this.subscribe,
			resubscribe:this.resubscribe,
			mock:this.mock,
			mockFile:this.mockFile
		};
	}
});
