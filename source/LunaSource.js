/**
	An <a href="#enyo.Source">enyo.Source</a> subkind designed to support webOS luna services.
	Intended to be used internaly by <a href="#enyo.ServiceModel">enyo.ServiceModel</a>, this
	source kind includes support for on-device as well as mock service calls
*/

enyo.kind({
	name: "enyo.LunaSource",
	kind: "enyo.Source",
	noDefer: true,
	/**
		The request is created and sent, saving the request object reference to the
		"request" property on the model.

		Fetch's optional parameters may include a json with the following properties:
			service - luna service URI
			method - service method to call
			subscribe - whether or not the request to subscribe to the service (default false)
			resubscribe - whether or not the request should resubscribe when an error is returned (default false)
			params - parameters payload to be sent with the service request
			success - callback on request success
			fail - callback on request failure
			mock - if true, <a href="#enyo.MockRequest">enyo.MockRequest</a> will be used in place of enyo.ServiceRequest
			mockFile - specify the json file to read for mock results, rather than autogenerating the filepath

		All properties (except for success and fail) may alternatively be included in the model itself, for convenience.
	*/
	fetch: function(model, opts) {
		var Kind = ((opts.mock || model.mock) ? enyo.MockRequest : enyo.ServiceRequest);
		var o = {
			service: (opts.service || model.service),
			method: (opts.method || model.method),
			subscribe: (opts.subscribe || model.subscribe),
			resubscribe: (opts.resubscribe || model.resubscribe),
			mockFile: (opts.mockFile || model.mockFile)
		};
		model.request = new Kind(o);
		model.request.response(function (req, res) {
			if(opts.success) {
				opts.success(res, req);
			}
		});
		model.request.error(function (req, res) {
			if(opts.fail) {
				opts.fail(res, req);
			}
		});
		model.request.go(opts.params || model.params || {});
	},
	/**
		With service requests, fetch and commit share identical routes, so see the 
		above fetch function.
	*/
	commit: function(model, opts) {
		//redirect to fetch as for services they're basically the same
		this.fetch(model, opts);
	},
	destroy: function (model, opts) {
		var req = model.request || opts.request;
		if(req && model.request.cancel) {
			model.request.cancel();
			model.request = undefined;
		}
	}
});
