var React = require("react");
var UI = require('touchstonejs').UI;

var ChallengeMap = React.createClass({
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},		
	getDefaultProps: function () {
        return {			
            initialZoom: 14,
        };
	},
	getInitialState: function () {
		return {
			map: null,
			processing: true
		};
	},	
	componentWillMount: function () {
		this.map = null;
	},
	componentWillUnMount: function () {
		this.map = null;
	},
	mapLoaded: function() {
		this.setState({ 
			processing: false
		});
	},	
	componentDidMount: function () {
		var self = this;
		var mapOptions = {
            center: this.mapCenterLatLng(
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude),
				zoom: this.props.initialZoom,
				disableDefaultUI: true,
			    panControl: false,
				zoomControl: true,
				scaleControl: false,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
				}
        };		
        this.map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
		this.setState({ 
			map: this.map
		});
		google.maps.event.addListener(this.map, 'tilesloaded', function(evt) {
			self.mapLoaded();
		});
	},	
	render: function () {
		
		if (this.state.map) {
			
			this.map.setCenter(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude));				

			var coordinates = [];
			for (var point in this.props.challenge.route) {
				coordinates.push(this.mapCenterLatLng(this.props.challenge.route[point].latitude, this.props.challenge.route[point].longitude));
			}

			var route = new google.maps.Polyline({
				path: coordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1,
				strokeWeight: 1.2
			});

			route.setMap(this.state.map);
			
			var startpoint,
				startflag,
				stoppoint,
				stopflag,
				checkpoint,
				chekpointflag,
				checkpointorder;
				
			startpoint = new google.maps.Circle(this.createPoint(
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude,
				'#31a354',
				'#a1d99b'				
			));
			
			startflag = this.markerWithLabel(" ", "<i class='icon ion-ios7-flag start-flag'></i>", 
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude,
				0, 32, 0.75);
						
			stoppoint = new google.maps.Circle(this.createPoint(
				this.props.challenge.stopPosition.latitude,
				this.props.challenge.stopPosition.longitude,
				'#2c7fb8',
				'#7fcdbb'
			));			
			
			stopflag = this.markerWithLabel(" ", "<i class='icon ion-ios7-flag stop-flag'></i>", 
				this.props.challenge.stopPosition.latitude,
				this.props.challenge.stopPosition.longitude,
				0, 32, 0.75);
			
			if (this.props.challenge.checkPoints)
			{
				for (var point in this.props.challenge.checkPoints)
				{					
					checkpoint = new google.maps.Circle(this.createPoint(
						this.props.challenge.checkPoints[point].latitude,
						this.props.challenge.checkPoints[point].longitude,
						'#e6550d',
						'#fdae6b'
					));
					
							
					chekpointflag = this.markerWithLabel(" ", "<i class='icon ion-flag checkpoint-flag'></i>", 
						this.props.challenge.checkPoints[point].latitude,
						this.props.challenge.checkPoints[point].longitude,
						0, 32, 0.75);
					
					var number = this.props.challenge.checkPoints[point].order;					
					console.log(number);	
					checkpointorder = this.markerWithLabel(" ", "<h2>"+number+"</h2>", 
						this.props.challenge.checkPoints[point].latitude,
						this.props.challenge.checkPoints[point].longitude,					
						-5, 15, 0.75);					
				}
			}		
		}		
		return (
			<div style={this.getBorderStyle()}>
				<div id='map' style={this.getStyle()}></div>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.processing} className="Modal-loading" />
			</div>
		);
	},
	createPoint: function(latitude, longitude, strokeColor, fillColor) {
		return startpointOptions = {
				strokeColor: strokeColor,
				strokeOpacity: 0.5,
				strokeWeight: 1.2,
				fillColor: fillColor,
				fillOpacity: 0.25,
				map: this.state.map,
				center: this.mapCenterLatLng(latitude, longitude),
			    radius: Math.sqrt(1) * 75
			};		
	},
	markerWithLabel: function(icon, labelContent, latitude, longitude, x, y, opacity) {
		return new MarkerWithLabel({
					icon: icon,
					position: this.mapCenterLatLng(latitude, longitude),
					draggable: false,
					map: this.state.map,
					labelContent: labelContent,
					labelAnchor: new google.maps.Point(x, y),
					labelClass: "labels", // the CSS class for the label
					labelStyle: {opacity: opacity}
				});		
	},	
    mapCenterLatLng: function (latitude, longitude) {
        return new google.maps.LatLng(latitude, longitude);
    },
	getBorderStyle: function () {
		return {
			background: 'none repeat scroll 0 0 #fff',
			boxShadow: '0 0 20px #999',
			padding: 5
		};
	},
	getStyle: function () {
		return {
			width: '100%',
			height: '300'
		};	
	}
});
module.exports = ChallengeMap;