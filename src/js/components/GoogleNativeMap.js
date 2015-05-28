var React = require("react");
var UI = require('touchstonejs').UI;

var GoogleNativeMap = React.createClass({
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
	mapLoaded: function () {
		console.log("map loaded");
	},
	componentDidMount: function () {		
		if (typeof plugin !== 'undefined')
		{
			var self = this;
			this.locationCircle = null; 		
			var mapDiv = document.getElementById("map");
			this.map = plugin.google.maps.Map.getMap(document.getElementById("map"),{
			  'backgroundColor': 'white',
			  'mapType': plugin.google.maps.MapTypeId.HYBRID,
			  'controls': {
				'compass': false,
				'myLocationButton': false,
				'indoorPicker': false,
				'zoom': true
			  },
			  'gestures': {
				'scroll': true,
				'tilt': false,
				'rotate': false,
				'zoom': true
			  },
			  'camera': {
				'latLng': this.mapCenterLatLng(),
				'tilt': 0,
				'zoom': this.props.initialZoom,
				'bearing': 50
			  }
			});
			this.map.on(plugin.google.maps.event.MAP_READY, self.mapLoaded);
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return (nextProps.latitude !== this.props.latitude || 
		    nextProps.longitude !== this.props.longitude ||
			nextProps.checkPoint !== this.props.checkPoint ||
			nextProps.tracking !== this.props.tracking ||
			nextState.processing !== this.state.processing);
	},
	render: function () {
		var self = this;
		if (this.map) {
			this.map.setCenter(this.mapCenterLatLng());

			if (this.locationCircle) {
				//this.locationCircle.setCenter(this.mapCenterLatLng());	
				this.locationCircle.setCenter(this.mapCenterLatLng())
			}
			else {				
				this.locationCircle = {
					'center': this.mapCenterLatLng(),
					'radius': 50,
					'strokeColor' : '#FF0000',
					'strokeWidth': 1,
					'fillColor' : '#FF0000'
				};				
				this.map.addCircle(this.locationCircle);				
			}
		}
		
		if (this.props.tracking) {
			
			if (!this.coordinates.length)
			{
				this.map.addMarker({
					'position': this.mapCenterLatLng(),
					'title': 'Start',
					'icon': 'images/ios7-flag.png'
				});		
				//var marker = this.markerWithLabel(" ", "<i class='icon ion-ios-flag start-flag'></i>", 0, 32, 0.75);
			}
			
			this.coordinates.push(this.mapCenterLatLng());
			
			this.map.addPolyline({
				points: this.coordinates,
				'color' : '#FF0000',
				'width': 1.2,
				'geodesic': true
			});
						
			//var route = new google.maps.Polyline({
			//	path: this.coordinates,
			//	geodesic: true,
			//	strokeColor: '#FF0000',
			//	strokeOpacity: 1,
			//	strokeWeight: 1.2
			//});
	
			//route.setMap(this.map);
	
			if (this.props.checkPoint)
			{
				//var checkPointOptions = this.circleOptions('#000000', 0.5, 1.2, '#000000',  0.25, 50);
				
				var checkPointOptions = {
					'center': this.mapCenterLatLng(),
					'radius': 50,
					'strokeColor' : '#000000',
					'strokeWidth': 1.2,
					'fillColor' : '#000000'
				};	
				
				this.map.addMarker({
					'position': this.mapCenterLatLng(),
					'title': ' ',
					'icon': 'images/flag.png'
				});	
				
				//var markerFlag = this.markerWithLabel(" ", "<i class='icon ion-flag checkpoint-flag'></i>", 0, 32, 0.75);
				//markerFlag.setMap( this.map );
				this.map.addCircle(checkPointOptions);
				//var checkpoint = new google.maps.Circle(checkPointOptions);							
			}
		};				
					
		return (
			<div id='map' className='gmap_div' style={this.getStyle()}>
				{this.props.children}
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
		//return new google.maps.LatLng(this.props.latitude, this.props.longitude);		 
		return new plugin.google.maps.LatLng(this.props.latitude,this.props.longitude);
	},	
	getTransparentStyle: function() {
		return {
			width: '100%',
			height: '100%',
			backgroundColor: 'transparent'
		};		
	},
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	},
});
module.exports = GoogleNativeMap;