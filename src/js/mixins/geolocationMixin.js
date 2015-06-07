var React = require("react");

var geolocationMixin = {

	getPosition: function () {
		var options = {
			maximumAge: this.props.maximumAge,
			timeout: this.props.timeout,
			enableHighAccuracy: this.props.enableHighAccuracy
		};
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
	},

	watchPosition: function () {
		var options = {
			maximumAge: this.props.maximumAge,
			timeout: this.props.timeout,
			enableHighAccuracy: this.props.enableHighAccuracy
		};
        this.watch_id = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
		console.log("Starting GPS: " + this.watch_id);
	},

	unwatchPosition: function () {
		if (this.watch_id) {
			navigator.geolocation.clearWatch(this.watch_id);
		}
	},

	onSuccess: function (position) {
		var location =  {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
		this.getCurrentPosition(location);
	},

	onError: function (err) {
	},

	getCurrentPosition: function (location) {
		if (location != undefined && !isNaN(location.latitude) && !isNaN(location.longitude)) {
			this.setState({location: location, checkPoint: false});
		}
	}
};

module.exports = geolocationMixin;