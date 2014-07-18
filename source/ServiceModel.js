(function (enyo, scope) {

	/**
	* A webOS service version of {@link enyo.Model} designed to allow
	* for proper formatting of service parameters within the Enyo data layer.
	*
	* Includes support for mock services via the mock property.
	*
	* Fetch/commit commands may include a json with the following properties:
	* 	success - callback function on request success
	* 	fail - callback function on request failure
	*
	* Service details (service, method, subscribe, mockFile, etc.) can be included within
	* fetch/commit options directly for overriding or inline setup.
	*
	* @class enyo.ServiceModel
	* @extends enyo.Model
	* @public
	*/
	enyo.kind(
		/** @lends enyo.ServiceModel.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.ServiceModel',

		/**
		* @private
		*/
		kind: 'enyo.Model',

		/**
		* Name of the created LunaSource source to use. Default naming scheme can be defined by:
		*
		* ```
		* enyo.Source.create({kind:'LunaSource'});
		* ```
		*
		* @type {String}
		* @default 'LunaSource'
		* @public
		*/
		source: 'LunaSource',

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
		* JSON parameters payload to send with the service request
		*
		* @type {Object}
		* @public
		*/
		params: undefined,

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
		* @public
		*/
		mockFile: undefined
	});

})(enyo, this);