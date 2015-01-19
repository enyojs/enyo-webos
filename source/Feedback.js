(function (enyo, scope) {

	/**
	* _enyo.Feedback is a component that play the feedback via {@link enyo.ServiceRequest}.
	*
	* @class enyo.Feedback
	* @extends enyo.Component
	* @public
	*/
	enyo.kind(
		/** @lends enyo.Feedback.prototype */ {

		/**
		* @private
		*/
		name: 'enyo.Feedback',

		/**
		* @private
		*/
		kind: 'enyo.Component',

		/**
		* The object of the enyo.ServiceRequest
		*
		* @private
		*/
		request: null,

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function(sup) {
			return function() {
				sup.apply(this, arguments);

				if (window.webOS) {
					// FIXME : For W2, we use the condition below. But it should be fixed later.
					if (webOS.device.modelName === "LGE Open webOS Device") {
						this.request = this.createComponent({
							kind: "enyo.ServiceRequest",
							service: "luna://com.palm.audio/systemsounds",
							method: "playFeedback"
						});
						this.request.error(this,"requestFailure");
					}
				} else {
					console.log("Invalid device for Palm services.");
				}
			};
		}),

		/**
		* @private
		*/
		requestFailure: function(request, error) {
			console.log("Error: " + error);
		},

		/**
		* Play the feedback sound
		*
		* @param {String} inParams - The param object to play
		* @public
		*/
		play: function (inParams) {
			if (window.webOS && this.request) {
				// FIXME : Check the platform is the W2 or the others(TV)
				if (webOS.device.modelName === "LGE Open webOS Device") {
					this.request.go(enyo.mixin({name: "touch", sink: "pfeedback"}, inParams));
				}
			} else {
				console.log("Invalid device for Palm services.");
			}
		}
	});

})(enyo, this);
