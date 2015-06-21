var React = require("react");
var UI = require('touchstonejs').UI;

var ChallengeMap = React.createClass({
	propTypes: {
		challenge: React.PropTypes.object.isRequired,
		height: React.PropTypes.string,
		latitude: React.PropTypes.number,
		longitude: React.PropTypes.number,
		initialZoom: React.PropTypes.number,
		position: React.PropTypes.string,
		challengeStarted: React.PropTypes.bool,
		radius: React.PropTypes.number,
		checkPoint: React.PropTypes.bool
	},		
	getDefaultProps: function () {
        return {			
            initialZoom: 13,
			height: 300,
			position: "relative",
			challengeStarted: false,
			radius: 25,
			checkPoint: false
        };
	},
	getInitialState: function () {
		return {
			processing: true
		};
	},	
	componentWillMount: function () {
		this.map = null;
	},
	componentWillUnMount: function () {
		this.map = null;
	},
	componentDidMount: function () {
		this.userCircle = null;
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
		google.maps.event.addListener(this.map, 'tilesloaded', function(evt) {
			self.mapLoaded();
		});
	},	
	shouldComponentUpdate: function(nextProps, nextState) {
		return (nextProps.challenge !== this.props.challenge || 
			nextProps.latitude !== this.props.latitude || 
		    nextProps.longitude !== this.props.longitude ||
			nextProps.challengeStarted !== this.props.challengeStarted ||
			nextState.processing !== this.state.processing);
	},
	render: function () {
		
		if (this.map) {
			console.log(this.props.checkPoint);
			if (!this.props.challengeStarted)
			{
				this.map.setCenter(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
					this.props.challenge.startPosition.longitude));				
			}
			else {
				this.map.setCenter(this.mapCenterLatLng(this.props.latitude,
					this.props.longitude));				
			}
			
			if (this.userCircle) {
				this.userCircle.setCenter(this.mapCenterLatLng(this.props.latitude, this.props.longitude));				
			}
			else {
				this.userCircle = new google.maps.Circle(this.createPoint(
					this.props.latitude,
					this.props.longitude,
					'#FF0000',
					'#FF0000'
				));					
			}
			if (this.props.checkPoint)
			{
				var passed = this.markerWithLabel(" ", "<i class='icon ion-ios-checkmark start-flag'></i>", 
					this.props.latitude,
					this.props.longitude,
					5, -15, 0.75);
			}
		}		
		return (
			<div style={this.getBorderStyle()}>
				<div id='map' style={this.getStyle()}></div>				
			</div>
		);
	},
	mapLoaded: function() {
		this.setState({ 
			processing: false
		});
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

			//route.setMap(this.state.map);
			route.setMap(this.map);	
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
			
			startflag = this.markerWithLabel(" ", "<i class='icon ion-ios-flag start-flag'></i>", 
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude,
				0, 32, 0.75);
						
			stoppoint = new google.maps.Circle(this.createPoint(
				this.props.challenge.stopPosition.latitude,
				this.props.challenge.stopPosition.longitude,
				'#2c7fb8',
				'#7fcdbb'
			));			
			
			stopflag = this.markerWithLabel(" ", "<i class='icon ion-ios-flag stop-flag'></i>", 
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
					checkpointorder = this.markerWithLabel(" ", "<h2>"+number+"</h2>", 
						this.props.challenge.checkPoints[point].latitude,
						this.props.challenge.checkPoints[point].longitude,					
						-5, 15, 0.75);					
				}
			}
	},	
	createPoint: function(latitude, longitude, strokeColor, fillColor) {
		return startpointOptions = {
				strokeColor: strokeColor,
				strokeOpacity: 0.5,
				strokeWeight: 1.2,
				fillColor: fillColor,
				fillOpacity: 0.25,
				/*map: this.state.map,*/
				map: this.map,
				center: this.mapCenterLatLng(latitude, longitude),
			    radius: this.props.radius
			};		
	},
	markerWithLabel: function(icon, labelContent, latitude, longitude, x, y, opacity) {
		return new MarkerWithLabel({
					icon: icon,
					position: this.mapCenterLatLng(latitude, longitude),
					draggable: false,
					/*map: this.state.map,*/
					map: this.map,
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
			height: this.props.height,
			position: this.props.position
		};	
	}
});
module.exports = ChallengeMap;