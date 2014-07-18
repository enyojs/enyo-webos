(function (enyo, scope) {

	/**
	* An extension of the {@link enyo.Async} object designed for webOS service requests.
	*
	* @class enyo.ServiceRequest
	* @extends enyo.Async
	* @public
	*/
	enyo.kind(
		/** @lends enyo.ServiceRequest.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.ServiceRequest',

		/**
		* @private
		*/
		kind: 'enyo.Async',

		/**
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
			resubscribe: false
		},

		/**
		* Execute the service request with an optional object for parameters to be sent.
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
			this.params = params || {};
			this.request = navigator.service.request(this.service, {
				method: this.method,
				parameters: this.params,
				subscribe: this.subscribe,
				resubscribe: this.resubscribe,
				onSuccess: enyo.bind(this, this.serviceSuccess),
				onFailure: enyo.bind(this, this.serviceFailure)
			});
			return this.request;
		},

		/**
		* Cancel the request/subscription.
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
		}
	});

})(enyo, this);