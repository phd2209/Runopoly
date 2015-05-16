var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var NearbyAreaList = require('../components/nearbyAreaList');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var NearbyAreaPage = React.createClass({
	mixins: [geolocationMixin, Navigation, ParseReact.Mixin],

	getDefaultProps: function () {
        return {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },

	observe: function(props, state) {
		return {
			areas: (new Parse.Query('Area')),
			user: ParseReact.currentUser
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
		 
		var sortedAreas = this.sortAreas(this.data.areas);
		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="OMRÅDER I NÆRHEDEN" type="runopoly">					
				</UI.Headerbar> 
				<UI.FlexBlock scrollable>
					<NearbyAreaList areas={sortedAreas} />
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />
			</UI.FlexLayout>
		);
	},
		
	sortAreas: function(areas) {	
		var self = this;
		var result = [];
		if (this.state.location == null || this.state.location == undefined) return result;
		_.each(areas, function (val) {
			var center = new google.maps.LatLng(val.center.latitude, val.center.longitude);
			var mypos = new google.maps.LatLng(self.state.location.latitude, self.state.location.longitude);
			var distance = Number((google.maps.geometry.spherical.computeDistanceBetween(mypos, center) / 1000).toFixed(2));
			var imageUrl = self.renderImagePath(val);
			val.distance = distance;
			val.imageUrl = imageUrl;
			var extendedArea = _.extend({distance: distance, imageUrl: imageUrl}, val);
			result.push(extendedArea);
		});
		return _.sortBy(result, function (num) { return num.distance; });
	},
	
	renderImagePath: function (area) {		
		var path = "", initial = "", len = area.coords.length, imageURL="";
		_.each(area.coords, function (value, key) {
			if (key === 0) initial = "|" + value.latitude + "," + value.longitude;
			if (key < len - 1) path =  path + "|" + value.latitude + "," + value.longitude;
			else path =  path + "|" + value.latitude + "," + value.longitude + initial;
		});				
		imageURL = "https://maps.googleapis.com/maps/api/staticmap?size=65x65&path=color:0xff0000ff|weight:1"+ path + "&zoom=" + area.zoom;
		//var imageURL = "test";
		return imageURL;
	},	
});

module.exports = NearbyAreaPage;