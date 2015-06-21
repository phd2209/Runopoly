var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var NearbyAreaList = require('../components/nearbyAreaList');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var RunStep1 = React.createClass({
	mixins: [geolocationMixin, Navigation, ParseReact.Mixin],
	getDefaultProps: function () {
        return {
			maximumAge: 0,
			timeout: 10000,
			enableHighAccuracy: true,
			prevView: 'page-home', 
		};
    },
	observe: function(props, state) {		
		if (state.location)
		{		
			var userGeoPoint = new Parse.GeoPoint({latitude: state.location.latitude, longitude: state.location.longitude});		
			return {
				challenge: (new Parse.Query('Challenge')
						.near('startPosition', userGeoPoint)
						.limit(5)			
				),
				results: (new Parse.Query('Results').include('challenge'))/*,
				user: ParseReact.currentUser*/
			};
		}
	},	
	getInitialState: function () {
		return {
			location: null,
			activeToggleItemKey: 0,
		};
	},
	componentWillMount: function () {
		this.getPosition();
	},	
	render: function () {
		var nearestChallenges = this.sortChallenges(this.data.challenge, this.data.results);

		return (
			<View>
				<UI.Headerbar label="NEARBY" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />
				</UI.Headerbar> 
				<UI.Headerbar type="default" height="36px" className="Subheader">
					<UI.Toggle value={this.state.activeToggleItemKey} onChange={this.handleToggleActiveChange} options={[
						{ label: 'Available', value: 0 },
						{ label: 'Completed', value: 1 }
					]} />
				</UI.Headerbar>				
				<UI.ViewContent scrollable>
					<NearbyAreaList challenges={nearestChallenges} filterState={this.state.activeToggleItemKey} />
				</UI.ViewContent>
				
			</View>
		);
	},	
	handleToggleActiveChange: function (newItem) {

		this.setState({
			activeToggleItemKey: newItem
		});

	},
	
	sortChallenges: function(challenges, results) {	
		var self = this;
		var result = [];
		if (this.state.location == null || this.state.location == undefined) return result;
		_.each(challenges, function (challenge) {
			var distance = Number(self.gps_distance(challenge.startPosition.latitude, challenge.startPosition.longitude,
				self.state.location.latitude, self.state.location.longitude).toFixed(2));
			var imageUrl = self.renderImagePath(challenge);
			var extendedChallenge = _.extend({distance: distance, imageUrl: imageUrl, completed: 0}, challenge);
			_.each(results, function (result) {
				if (challenge.objectId == result.challenge.objectId) {				
					if (result.status) 
						extendedChallenge.completed = 1;
				}
			});		
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
		//var imageURL = "http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/47.619048,-122.35384/15?mapSize=65,65&pp=47.620495,-122.34931;21;AA&pp=47.619385,-122.351485;;AB&pp=47.616295,-122.3556;22&mapMetadata=1&o=xml&key=AuAHBbCwL3pG2rjo0Pb_O4wjIKHzdKQLIUGMndhAaXZUv9d7Oa_JyamaDkNrnuQd";
		var path = "", initial = "", len = challenge.route.length, imageURL="", zoom=15;
		_.each(challenge.route, function (value, key) {
			if (key === 0) initial = "|" + value.latitude + "," + value.longitude;
			if (key < len - 1) path =  path + "|" + value.latitude + "," + value.longitude;
			else path =  path + "|" + value.latitude + "," + value.longitude + initial;
		});				
		//imageURL = "https://maps.googleapis.com/maps/api/staticmap?size=65x65&path=color:0xff0000ff|weight:1"+ path + "&zoom=" + zoom;
		var imageURL = "test";
		return imageURL;
	},	
});
module.exports = RunStep1;