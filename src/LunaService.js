/**
* Contains the declaration for the {@link module:enyo-webos/LunaService~LunaService} kind.
* @module enyo-webos/LunaService
*/

var
	utils = require('enyo/utils'),
	kind = require('enyo/kind');

var
	Component = require('enyo/Component'),
	MockRequest = require('./MockRequest'),
	ServiceRequest = require('./ServiceRequest');

/**
* Fires when a response is received. Event data contains the returned response. The `originator`
* property will contain the calling {@link module:enyo-webos/ServiceRequest~ServiceRequest}.
*
* @event module:enyo-webos/LunaService~LunaService#onResponse
* @type {Object}
* @public
*/

/**
* Fires when an error is received. Event data contains the error data. The `originator` property
* will contain the calling {@link module:enyo-webos/ServiceRequest~ServiceRequest}.
*
* @event module:enyo-webos/LunaService~LunaService#onError
* @type {Object}
* @public
*/

/**
* Fires when a service request is complete (regardless of success or failure). Event data
* contains the response data and/or error data. The `originator` property will contain the
* calling {@link module:enyo-webos/ServiceRequest~ServiceRequest}.
*
* @event module:enyo-webos/LunaService~LunaService#onComplete
* @type {Object}
* @public
*/

/**
* {@link module:enyo-webos/LunaService~LunaService} is a component similar to
* {@link module:enyo/WebService~WebService}, but for LS2 service requests.
*
* Internally, it generates a new {@link module:enyo-webos/ServiceRequest~ServiceRequest}
* for each `[send()]{@link module:enyo-webos/LunaService~LunaService#send}` call,
* keeping track of each request made and sending out resulting events as they
* occur. This allows multiple concurrent request calls to be sent without any
* potential overlap or garbage collection issues.
*
* @class LunaService
* @extends module:enyo/Component~Component
* @public
*/
module.exports = kind(
	/** @lends module:enyo-webos/LunaService~LunaService.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.LunaService',

	/**
	* @private
	*/
	kind: Component,

	/**
	* @lends module:enyo-webos/LunaService~LunaService.prototype
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
		resubscribe: false,
		
		/**
		* The number of milliseconds to wait before failing with a _timeout_ error. This only
		* takes effect for non-zero values.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		timeout: 0
	},

	/**
	* If true, {@link module:enyo-webos/MockRequest~MockRequest} will be used in
	* place of {@link module:enyo-webos/ServiceRequest~ServiceRequest}.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	mock: false,

	/**
	* Optionally specifies a JSON file to read for mock results, rather than
	* autogenerating the filepath.
	*
	* @type {String}
	* @default `undefined`
	* @public
	*/
	mockFile: undefined,

	/**
	* @private
	*/
	events: {
		onResponse: '',
		onError: '',
		onComplete: ''
	},

	/**
	* Needed for referencing to `enyo-webos/PalmService` for compatability.
	*
	* @private
	*/
	noDefer: true,

	/**
	* @private
	*/
	create: function () {
		this.inherited(arguments);
		this.activeRequests = [];
		this.activeSubscriptionRequests = [];
	},

	/**
	* Sends a webOS service request with the passed-in parameters, returning the associated
	* {@link module:enyo-webos/ServiceRequest~ServiceRequest} instance.
	*
	* @param {Object} params - Hash of parameters for the request
	* @return {module:enyo-webos/ServiceRequest~ServiceRequest}
	* @public
	*/
	send: function (params) {
		params = params || {};
		var request = this.createComponent({
			kind: ((this.mock) ? MockRequest : ServiceRequest),
			service: this.service,
			method: this.method,
			subscribe: this.subscribe,
			resubscribe: this.resubscribe,
			timeout: this.timeout
		});
		if(this.mock && this.mockFile) {
			request.mockFile = this.mockFile;
		}
		request.originalCancel = request.cancel;
		request.cancel = utils.bind(this, 'cancel', request);
		request.response(this, 'requestSuccess');
		request.error(this, 'requestFailure');
		if(this.subscribe && !this.mock) {
			this.activeSubscriptionRequests.push(request);
		} else {
			this.activeRequests.push(request);
		}
		request.go(params);
		return request;
	},

	/**
	* Cancels the specified request.  The equivalent of
	* `[request.cancel()]{@link module:enyo-webos/ServiceRequest~ServiceRequest#cancel}`.
	*
	* @param {module:enyo-webos/ServiceRequest~ServiceRequest} request - The request to cancel
	* @public
	*/
	cancel: function (request) {
		this.removeRequest(request);
		request.originalCancel();
	},

	/**
	* Removes the specified request from the active request arrays.
	*
	* @param {module:enyo-webos/ServiceRequest~ServiceRequest} request - The request to remove
	* @private
	*/
	removeRequest: function (request) {
		var i = -1;
		i = this.activeRequests.indexOf(request);
		if (i !== -1) {
			this.activeRequests.splice(i, 1);
		} else {
			i = this.activeSubscriptionRequests.indexOf(request);
			if (i !== -1) {
				this.activeSubscriptionRequests.splice(i, 1);
			}
		}
	},

	/**
	* @fires {@link module:enyo-webos/LunaService~LunaService#onResponse}
	* @private
	*/
	requestSuccess: function (request, response) {
		response.originator = request;
		this.doResponse(response);
		this.requestComplete(request, response);
	},

	/**
	* @fires {@link module:enyo-webos/LunaService~LunaService#onError}
	* @private
	*/
	requestFailure: function (request, error) {
		error.originator = request;
		this.doError(error);
		this.requestComplete(request, error);
	},

	/**
	* @fires {@link module:enyo-webos/LunaService~LunaService#onComplete}
	* @private
	*/
	requestComplete: function (request, data) {
		var i = -1;
		i = this.activeRequests.indexOf(request);
		if (i !== -1) {
			this.activeRequests.splice(i, 1);
		}
		this.doComplete(data);
	},

	/**
	* Cancels any active requests.
	*
	* @see {@link module:enyo/CoreObject~Object#destroy}
	* @private
	*/
	destroy: function () {
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