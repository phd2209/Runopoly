var React = require("react");
var UI = require('touchstonejs').UI;

var GoogleMap = React.createClass({
	propTypes: {
		latitude: React.PropTypes.number.isRequired,
		longitude: React.PropTypes.number.isRequired,
		tracking: React.PropTypes.bool.isRequired,
		checkPoint: React.PropTypes.bool.isRequired
	},
	getDefaultProps: function () {
        return {			
            initialZoom: 15,
            latitude: 55.717548,
            longitude: 12.544479,
			tracking: false,
			checkPoints: []
        };
	},
	getInitialState: function () {
		return {
			processing: true,
		};
	},
	componentWillMount: function () {
		this.map = null;
		this.coordinates = [];		
	},
	componentWillUnMount: function () {
		this.map = null;
		this.coordinates = [];
	},	
	mapLoaded: function() {
		this.setState({ 
			processing: false
		});
	},	
	componentDidMount: function () {		
		var self = this;
		this.locationCircle = null; 		
		
		var mapOptions = {
			center: this.mapCenterLatLng(),
			zoom: this.props.initialZoom,
			disableDefaultUI: true
		};

		this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		google.maps.event.addListener(this.map, 'tilesloaded', function(evt) {
			self.mapLoaded();
		});
	},		
	shouldComponentUpdate: function(nextProps, nextState) {
		return (nextProps.latitude !== this.props.latitude || 
		    nextProps.longitude !== this.props.longitude ||
			nextProps.checkPoint !== this.props.checkPoint ||
			nextProps.tracking !== this.props.tracking ||
			nextState.processing !== this.state.processing);
	},
	render: function () {
		
		if (this.map) {
			this.map.setCenter(this.mapCenterLatLng());

			if (this.locationCircle) {
				this.locationCircle.setCenter(this.mapCenterLatLng());				
			}
			else {
				var circleOptions = this.circleOptions('#FF0000', 0.5, 1, '#FF0000',  0.25, 50);	
				this.locationCircle = new google.maps.Circle(circleOptions);					
			}
		}
		if (this.props.tracking) {
			
			if (!this.coordinates.length)
			{
				var marker = this.markerWithLabel(" ", "<i class='icon ion-ios-flag start-flag'></i>", 0, 32, 0.75);
			}
			
			this.coordinates.push(this.mapCenterLatLng());
	
			var route = new google.maps.Polyline({
				path: this.coordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1,
				strokeWeight: 1.2
			});
	
			route.setMap(this.map);
	
			if (this.props.checkPoint)
			{
				var checkPointOptions = this.circleOptions('#000000', 0.5, 1.2, '#000000',  0.25, 50);
				var markerFlag = this.markerWithLabel(" ", "<i class='icon ion-flag checkpoint-flag'></i>", 0, 32, 0.75);
				markerFlag.setMap( this.map );
				var checkpoint = new google.maps.Circle(checkPointOptions);							
			}
		};				
							
		return (
			<div style={this.getStyle()}> 
			<div id='map' style={this.getStyle()}></div>
			<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.processing} className="Modal-loading" />
			</div>
		);
	},
	circleOptions: function(strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity, num) {
		return  {
			strokeColor: strokeColor,
			strokeOpacity: strokeOpacity,
			strokeWeight: strokeWeight,
			fillColor: fillColor,
			fillOpacity: fillOpacity,
			map: this.map,
			center: this.mapCenterLatLng(),
			radius: Math.sqrt(1) * num
		};
	},
	markerWithLabel: function(icon, labelContent, x, y, opacity) {
		return new MarkerWithLabel({
					icon: icon,
					position: this.mapCenterLatLng(),
					draggable: false,
					map: this.map,
					labelContent: labelContent,
					labelAnchor: new google.maps.Point(x, y),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: opacity}
				});		
	},
    mapCenterLatLng: function () {
		return new google.maps.LatLng(this.props.latitude, this.props.longitude);		 
    },	
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	},
});
module.exports = GoogleMap;