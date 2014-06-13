/**
	A webOS service version of <a href="#enyo.Model">enyo.Model</a> designed to allow
	for proper formatting of service parameters within the Enyo data layer.
	
	Includes support for mock services via the mock property.
	
	Fetch/commit commands may include a json with the following properties:
		success - callback function on request success
		fail - callback function on request failure

	Service details (service, method, subscribe, mockFile, etc.) can be included within
	fetch/commit options directly for overriding or inline setup.
*/

enyo.kind({
	name: "enyo.ServiceModel",
	kind: "enyo.Model",
	/**
		Name of the created LunaSource source to use. Default naming scheme can be defined by:

			enyo.Source.create({kind:"LunaSource"});
	*/
	source: "LunaSource",
	//* Luna service URI.  Starts with luna://
	service: "",
	//* Service method you want to call
	method: "",
	//* JSON parameters payload to send with the service request
	params: undefined,
	//* Whether or not the request to subscribe to the service
	subscribe: false,
	//* Whether or not the request should resubscribe when an error is returned
	resubscribe: false,
	//* If true, <a href="#enyo.MockRequest">enyo.MockRequest</a> will be used in place of enyo.ServiceRequest
	mock: false,
	//* Optionally specify the json file to read for mock results, rather than autogenerating the filepath
	mockFile: undefined
});
