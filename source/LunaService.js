(function (enyo, scope) {

	/**
	* Fires when a response is received. Event data contains the returned response. The `originator`
	* property will contain the calling <a href='#enyo.ServiceRequest'>enyo.ServiceRequest</a>.
	*
	* @event enyo.LunaService#event:onResponse
	* @type {Object}
	* @public
	*/

	/**
	* Fires when an error is received. Event data contains the error data. The `originator` property
	* will contain the calling <a href='#enyo.ServiceRequest'>enyo.ServiceRequest</a>.
	*
	* @event enyo.LunaService#event:onError
	* @type {Object}
	* @public
	*/

	/**
	* Fires when a service request is complete (regardless of success or failure). Event data
	* contains the response data and/or error data. The `originator` property will contain the
	* calling <a href='#enyo.ServiceRequest'>enyo.ServiceRequest</a>.
	*
	* @event enyo.LunaService#event:onComplete
	* @type {Object}
	* @public
	*/

	/**
	* _enyo.LunaService_ is a component similar to {@link enyo.WebService}, but for
	* LS2 service requests.
	*
	* Internally it generates new {@link enyo.ServiceRequest} for each
	* `[send()]{@link enyo.LunaService#send}` call, keeping track of each request made and sending
	* out resulting events as they occur. This allows for multiple concurrent request calls to be
	* sent without any potential overlap or gc issues.
	*
	* @class enyo.LunaService
	* @extends enyo.Component
	* @public
	*/
	enyo.kind(
		/** @lends enyo.LunaService.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.LunaService',

		/**
		* @private
		*/
		kind: 'enyo.Component',

		/**
		* @lends enyo.LunaService.prototype
		* @private
		*/
		published: {

			/**
			* Luna service URI.  Starts with luna://
			*
			* @type {String}
			* @default ''
			* @public
			*/
			service: '',

			/**
			* Service method you want to call
			*
			* @type {String}
			* @default ''
			* @public
			*/
			method: '',

			/**
			* Whether or not the request to subscribe to the service
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			subscribe: false,

			/**
			* Whether or not the request should resubscribe when an error is returned
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
		* If true, {@link enyo.MockRequest} will be used in place of {@link enyo.ServiceRequest}
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		mock: false,

		/**
		* Optionally specify the json file to read for mock results, rather than autogenerating the
		* filepath
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
		* Needed for referencing to enyo.PalmService for compatability
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
		* {@link enyo.ServiceRequest} instance.
		*
		* @param {Object} params - Hash of parameters for the request
		* @return {enyo.ServiceRequest}
		* @public
		*/
		send: function (params) {
			params = params || {};
			var request = this.createComponent({
				kind: ((this.mock) ? 'enyo.MockRequest' : 'enyo.ServiceRequest'),
				service: this.service,
				method: this.method,
				subscribe: this.subscribe,
				resubscribe: this.resubscribe
			});
			if(this.mock && this.mockFile) {
				request.mockFile = this.mockFile;
			}
			request.originalCancel = request.cancel;
			request.cancel = enyo.bind(this, 'cancel', request);
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
		* Cancels a given request.  The equivalent of
		* `[request.cancel()]{@link enyo.ServiceRequest#cancel}`
		*
		* @param {enyo.ServiceRequest} request - Request to cancel
		* @public
		*/
		cancel: function (request) {
			this.removeRequest(request);
			request.originalCancel();
		},

		/**
		* Removes the request from the active request arrays
		*
		* @param {enyo.ServiceRequest} reuqest - Request to remove
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
		* @fires enyo.LunaService#event:onResponse
		* @private
		*/
		requestSuccess: function (request, response) {
			response.originator = request;
			this.doResponse(response);
			this.requestComplete(request, response);
		},

		/**
		* @fires enyo.LunaService#event:onError
		* @private
		*/
		requestFailure: function (request, error) {
			error.originator = request;
			this.doError(error);
			this.requestComplete(request, error);
		},

		/**
		* @fires enyo.LunaService#event:onComplete
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
		* Cancels any active requests
		*
		* @see enyo.Object#destroy
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
	enyo.PalmService = enyo.LunaService;

})(enyo, this);
