var React = require("react");
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
	componentWillMount: function () {
		this.map = null;
		this.coordinates = [];
	},
	componentWillUnMount: function () {
		this.map = null;
		this.coordinates = [];
	},
	componentDidMount: function () {		
		this.locationCircle = null; 		
		var mapOptions = {
			center: this.mapCenterLatLng(),
			zoom: this.props.initialZoom
		};			
		this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
	},	
	shouldComponentUpdate: function(nextProps, nextState) {
		return (nextProps.latitude !== this.props.latitude || 
		    nextProps.longitude !== this.props.longitude ||
			nextProps.checkPoint !== this.props.checkPoint ||
			nextProps.tracking !== this.props.tracking);
	},	
	render: function () {
		
		if (this.map) {
			this.map.setCenter(this.mapCenterLatLng());

			if (this.locationCircle) {
				this.locationCircle.setCenter(this.mapCenterLatLng());				
			}
			else {
				var circleOptions = {
					strokeColor: '#FF0000',
					strokeOpacity: 0.5,
					strokeWeight: 1,
					fillColor: '#FF0000',
					fillOpacity: 0.25,
					map: this.map,
					center: this.mapCenterLatLng(),
					radius: Math.sqrt(1) * 50
				};
				// Add the circle for this city to the map.			
				this.locationCircle = new google.maps.Circle(circleOptions);					
			}
		}
		if (this.props.tracking) {
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
				var checkPointOptions = {
					strokeColor: '#000000',
					strokeOpacity: 0.5,
					strokeWeight: 1.2,
					fillColor: '#000000',
					fillOpacity: 0.25,
					map: this.map,
					center: this.mapCenterLatLng(),
					radius: Math.sqrt(1) * 50
				};

				var marker = new MarkerWithLabel({
					icon: " ",
					position: this.mapCenterLatLng(),
					draggable: false,
					map: this.map,
					labelContent: "<i class='icon ion-flag checkpoint-flag'></i>",
					labelAnchor: new google.maps.Point(0, 32),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: 0.75}
				});		
			
				marker.setMap( this.map );
				var checkpoint = new google.maps.Circle(checkPointOptions);							
			}
		};				
							
		return (
			<div id='map' style={this.getStyle()}></div>			
		);
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