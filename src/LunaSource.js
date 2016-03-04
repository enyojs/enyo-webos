/**
* Contains the declaration for the {@link module:enyo-webos/LunaSource~LunaSource} kind.
* @module enyo-webos/LunaSource
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils');

var
	Source = require('enyo/Source'),
	MockRequest = require('./MockRequest'),
	ServiceRequest = require('./ServiceRequest');

/**
* Optional parameters for {@link module:enyo-webos/LunaSource~LunaSource#fetch}.
*
* @typedef module:enyo-webos/LunaSource~LunaSource~FetchOptions
* @type {Object}
* @property {String} service      - Luna service URI
* @property {String} method       - The service method to call
* @property {Boolean} subscribe   - Whether or not the request should subscribe to the service (default false)
* @property {Boolean} resubscribe - Whether or not the request should resubscribe when an error is returned (default false)
* @property {Object} params       - Payload of parameters to be sent with the service request
* @property {Function} success    - Callback on request success
* @property {Function} fail       - Callback on request failure
* @property {Boolean} mock        - If `true`, {@link module:enyo-webos/MockRequest~MockRequest} will be used in place of enyo/ServiceRequest
* @property {String} mockFile     - Specifies a JSON file to read for mock results, rather than autogenerating the filepath
* @property {Number} timeout      - The number of milliseconds to wait before failing with a _timeout_ error. This only takes effect for non-zero values.
* @public
*/

/**
* A subkind of {@link module:enyo/Source~Source} designed to support webOS Luna services.
* Intended to be used internally by {@link module:enyo-webos/ServiceModel~ServiceModel},
* this source kind includes support for on-device as well as mock service calls.
*
* @class LunaSource
* @extends module:enyo/Source~Source
* @public
*/
module.exports = kind(
	/** @lends module:enyo-webos/LunaSource~LunaSource.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.LunaSource',

	/**
	* @private
	*/
	kind: Source,

	/**
	* @private
	*/
	constructor: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.activeRequests = [];
			this.activeSubscriptionRequests = [];
		};
	}),

	/**
	* The request is created and sent, saving the request object reference to the
	* 'request' property on the model.
	*
	* @param {module:enyo-webos/ServiceModel~ServiceModel} model - The model to fetch
	* @param {module:enyo-webos/LunaSource~LunaSource~FetchOptions} opts - Fetch options.
	* 	All properties (except for success and fail) may alternatively be included
	* 	in the model itself, for convenience.
	* @public
	*/
	fetch: function (model, opts) {
		var Kind = ((opts.mock || model.mock) ? MockRequest : ServiceRequest);
		var o = {
			service: (opts.service || model.service),
			method: (opts.method || model.method),
			subscribe: (opts.subscribe || model.subscribe),
			resubscribe: (opts.resubscribe || model.resubscribe),
			mockFile: (opts.mockFile || model.mockFile),
			timeout: (opts.timeout || model.timeout || 0)
		};
		model.request = new Kind(o);
		model.request.originalCancel = model.request.cancel;
		model.request.cancel = utils.bind(this, 'cancel', model.request);
		model.request.response(this.requestSuccess.bind(this, opts), this);
		model.request.error(this.requestFailure.bind(this, opts), this);

		if (model.request.subscribe && !(opts.mock || model.mock)) {
			this.activeSubscriptionRequests.push(model.request);
		} else {
			this.activeRequests.push(model.request);
		}

		model.request.go(opts.params || model.params || {});

		return model.request;
	},

	cancel: function (req) {
		this.removeRequest(req);
		req.originalCancel();
	},

	removeRequest: function (req) {
		if (req.subscribe) {
			utils.remove(this.activeSubscriptionRequests, req);
		} else {
			utils.remove(this.activeRequests, req);
		}
	},

	requestSuccess: function (opts, req, res) {
		if (opts.success) {
			opts.success(res, req);
		}

		if (!req.subscribe) {
			this.removeRequest(req);
		}
	},

	requestFailure: function (opts, req, error) {
		if (opts.error) {
			opts.error(error, req);
		}

		if (!req.resubscribe) {
			this.removeRequest(req);
		}
	},

	/**
	* With service requests, fetch and commit share identical routes.
	*
	* @param {module:enyo-webos/ServiceModel~ServiceModel} model - The Model to commit
	* @param {module:enyo-webos/LunaSource~LunaSource~FetchOptions} opts - Commit options
	* @see {@link module:enyo-webos/LunaSource~LunaSource#fetch}
	* @public
	*/
	commit: function (model, opts) {
		//redirect to fetch as for services they're basically the same
		this.fetch(model, opts);
	},

	/**
	* @private
	*/
	destroy: function (model, opts) {
		var i;
		for (i=0; i<this.activeRequests.length; i++) {
			this.activeRequests[i].originalCancel();
		}
		delete this.activeRequests;

		for (i=0; i<this.activeSubscriptionRequests.length; i++) {
			this.activeSubscriptionRequests[i].originalCancel();
		}
		delete this.activeSubscriptionRequests;

		var req = model.request || opts.request;
		if (req && model.request.cancel) {
			model.request.cancel();
			model.request = undefined;
		}
	}
});
