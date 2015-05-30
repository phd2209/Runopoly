var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var NearbyAreaList = require('../components/nearbyAreaList');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var RunStep1 = React.createClass({
	mixins: [geolocationMixin, Navigation, ParseReact.Mixin],
	getDefaultProps: function () {
        return {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true,
			prevView: 'page-home', 
		};
    },
	observe: function(props, state) {
		return {
			challenge: (new Parse.Query('Challenge')) /*,
			user: ParseReact.currentUser*/
		};
	},	
	getInitialState: function () {
		return {
			location: null
		};
	},
	componentWillMount: function () {
		this.watchPosition();
	},	
	componentWillUnmount: function () {
		this.unwatchPosition();
	},
	render: function () {
		var nearestChallenges = this.sortChallenges(this.data.challenge);
		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="NEARBY" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />
				</UI.Headerbar> 
				<UI.FlexBlock scrollable>
					<NearbyAreaList challenges={nearestChallenges} />
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />
			</UI.FlexLayout>
		);
	},		
	sortChallenges: function(challenges) {	
		var self = this;
		var result = [];
		if (this.state.location == null || this.state.location == undefined) return result;
		_.each(challenges, function (val) {
			//var center = new google.maps.LatLng(val.startPosition.latitude, val.startPosition.longitude);
			//var mypos = new google.maps.LatLng(self.state.location.latitude, self.state.location.longitude);
			//var distance = Number((google.maps.geometry.spherical.computeDistanceBetween(mypos, center) / 1000).toFixed(2));
			var distance = Number(self.gps_distance(val.startPosition.latitude, val.startPosition.longitude,
				self.state.location.latitude, self.state.location.longitude).toFixed(2));
			var imageUrl = self.renderImagePath(val);
			val.distance = distance;
			val.imageUrl = imageUrl;
			var extendedChallenge = _.extend({distance: distance, imageUrl: imageUrl}, val);
			result.push(extendedChallenge);
		});
		return _.sortBy(result, function (num) { return num.distance; });
	},	
	// Calculate distance of route
	// and duration
    gps_distance: function (lat1, lon1, lat2, lon2) {
        // http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // km
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var lat1 = lat1 * (Math.PI / 180);
        var lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },		
	renderImagePath: function (challenge) {		
		//var path = "", initial = "", len = challenge.route.length, imageURL="", zoom=15;
		//_.each(challenge.route, function (value, key) {
		//	if (key === 0) initial = "|" + value.latitude + "," + value.longitude;
		//	if (key < len - 1) path =  path + "|" + value.latitude + "," + value.longitude;
		//	else path =  path + "|" + value.latitude + "," + value.longitude + initial;
		//});				
		//imageURL = "https://maps.googleapis.com/maps/api/staticmap?size=65x65&path=color:0xff0000ff|weight:1"+ path + "&zoom=" + zoom;
		var imageURL = "test";
		return imageURL;
	},	
});
module.exports = RunStep1;