enyo.kind({
	name: "enyo.LS2Source",
	kind: "enyo.Source",
	fetch: function(rec, opts) {
		var Kind = ((rec.mock) ? "enyo.ServiceRequest" : "enyo.MockRequest");
		var o = enyo.only(this._serviceOptions, rec);
		rec.request = new Kind(o);
		var params = enyo.except(this._callbacks, opts);
		rec.request.response(opts.success);
		rec.request.error(opts.fail);
		rec.request.go(params);
	},
	commit: function(rec, opts) {
		//redirect to fetch as for services they're basically the same
		this.fetch(rec, opts);
	},
	destroy: function (rec, opts) {
		if(rec && rec.request && rec.request.cancel) {
			rec.request.cancel()
			rec.request = undefined;
		}
	},
	//* @protected
	_serviceOptions: ["service", "method", "subscribe", "resubscribe", "mockFile"],
	_callbacks: ["success", "fail"]
});
//add to store
enyo.store.addSources({service:"enyo.LS2Source"});
