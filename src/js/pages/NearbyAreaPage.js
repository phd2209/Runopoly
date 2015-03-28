var React = require("react");
var NearbyAreaList = require('../components/nearbyAreaList');
var areaService = require('../utils/areaservice');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var NearbyAreaPage = React.createClass({
	mixins: [geolocationMixin, Navigation],

	getDefaultProps: function () {
        return {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },

	getInitialState: function () {
		return {
			areas: [],
			location: null,
			modalLoadingVisible: false,
		};
	},

	componentWillMount: function () {
		this.watchPosition();

		this.setState({
			modalLoadingVisible: true
		});
		
		areaService.getAll().done(function (areas) {
			this.setState({
				areas: areas,
				modalLoadingVisible: false
			});
		}.bind(this));
	},
	
	componentWillUnmount: function () {
		this.unwatchPosition();
	},

	render: function () {

		var sortedAreas = this.sortAreas(this.state.areas);

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="OMRÅDER I NÆRHEDEN" type="runopoly">					
				</UI.Headerbar> 
				<UI.FlexBlock scrollable>
					<NearbyAreaList areas={sortedAreas} />
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.modalLoadingVisible} className="Modal-loading" />
			</UI.FlexLayout>
		);
	},
		
	sortAreas: function(areas) {		
		var self = this;				
		if (this.state.location == null || this.state.location == undefined) return areas;
		_.each(areas, function (val, i) {
			var center = new google.maps.LatLng(val.latitude, val.longitude);
			var mypos = new google.maps.LatLng(self.state.location.latitude, self.state.location.longitude);
			var distance = (google.maps.geometry.spherical.computeDistanceBetween(mypos, center) / 1000).toFixed(2);	
			val.distance = Number(distance);
			val.imageUrl = self.renderImagePath(val);
		});
		return _.sortBy(areas, function (num) { return num.distance; });
	},
	
	renderImagePath: function (area) {
		var path = "", initial = "", len = area.coords.length, imageURL="";
		_.each(area.coords, function (value, key) {
			if (key === 0) initial = "|" + value.latitude + "," + value.longitude;
			if (key < len - 1) path =  path + "|" + value.latitude + "," + value.longitude;
			else path =  path + "|" + value.latitude + "," + value.longitude + initial;
		});			
		imageURL = "https://maps.googleapis.com/maps/api/staticmap?size=65x65&path=color:0xff0000ff|weight:1"+ path + "&zoom=" + area.zoom;
		//var imageurl = "test";
		return imageURL;
	},	
});

module.exports = NearbyAreaPage;