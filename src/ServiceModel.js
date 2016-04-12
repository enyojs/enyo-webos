/**
* Contains the declaration for the {@link module:enyo-webos/ServiceModel~ServiceModel} kind.
* @module enyo-webos/ServiceModel
*/

var
	kind = require('enyo/kind');

var
	Model = require('enyo/Model'),
	LunaSource = require('./LunaSource');

/**
* A webOS service version of {@link module:enyo/Model~Model} designed to allow
* for proper formatting of service parameters within the Enyo data layer.
*
* Includes support for mock services via the `mock` property.
*
* Fetch/commit commands may include a json with the following properties:
* 	`success` - callback function on request success
* 	`fail` - callback function on request failure
*
* Service details (service, method, subscribe, mockFile, etc.) can be included within
* fetch/commit options directly for overriding or inline setup.
*
* @class ServiceModel
* @extends module:enyo/Model~Model
* @public
*/
module.exports = kind(
	/** @lends module:enyo-webos/ServiceModel~ServiceModel.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.ServiceModel',

	/**
	* @private
	*/
	kind: Model,

	/**
	* Name of the created LunaSource source to use. Default naming scheme can be defined by:
	*
	* ```
	* var
	*     Source = require('enyo/Source');
	*
	* Source.create({kind:'LunaSource'});
	* ```
	*
	* @type {String}
	* @default 'LunaSource'
	* @public
	*/
	source: LunaSource,

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
	* The payload of JSON parameters to send with the service request.
	*
	* @type {Object}
	* @public
	*/
	params: undefined,

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
	* If `true`, {@link module:enyo-webos/MockRequest~MockRequest} will be used in
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
	* @public
	*/
	mockFile: undefined
});