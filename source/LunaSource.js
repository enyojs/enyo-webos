(function (enyo, scope) {

	/**
	* Optional parameters for {@link enyo.LunaSource#fetch}
	*
	* @typedef enyo.LunaSource~FetchOptions
	* @type {Object}
	* @property {String} service      - luna service URI
	* @property {String} method       - service method to call
	* @property {Boolean} subscribe   - whether or not the request to subscribe to the service (default false)
	* @property {Boolean} resubscribe - whether or not the request should resubscribe when an error is returned (default false)
	* @property {Object} params       - parameters payload to be sent with the service request
	* @property {Function} success    - callback on request success
	* @property {Function} fail       - callback on request failure
	* @property {Boolean} mock        - if true, <a href='#enyo.MockRequest'>enyo.MockRequest</a> will be used in place of enyo.ServiceRequest
	* @property {String} mockFile     - specify the json file to read for mock results, rather than autogenerating the filepath
	* @public
	*/

	/**
	* An {@link enyo.Source} subkind designed to support webOS luna services.
	* Intended to be used internaly by {@link enyo.ServiceModel}, this
	* source kind includes support for on-device as well as mock service calls
	*
	* @class  enyo.LunaSource
	* @extends enyo.Source
	* @public
	*/
	enyo.kind(
		/** @lends enyo.LunaSource.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.LunaSource',

		/**
		* @private
		*/
		kind: 'enyo.Source',

		/**
		* @private
		*/
		noDefer: true,

		/**
		* The request is created and sent, saving the request object reference to the
		* 'request' property on the model.
		*
		* @param {enyo.ServiceModel} model - Model to fetch
		* @param {enyo.LunaSource~FetchOptions} opts - Fetch options. All properties (except for
		* 	success and fail) may alternatively be included in the model itself, for convenience.
		* @public
		*/
		fetch: function (model, opts) {
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
		* With service requests, fetch and commit share identical routes.
		*
		* @param {enyo.ServiceModel} model - Model to commit
		* @param {enyo.LunaSource~FetchOptions} opts - Commit options
		* @see enyo.LunaSource#fetch
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
			var req = model.request || opts.request;
			if(req && model.request.cancel) {
				model.request.cancel();
				model.request = undefined;
			}
		}
	});

})(enyo, this);