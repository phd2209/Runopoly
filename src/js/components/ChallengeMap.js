var React = require("react");

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
			map: null
		};
	},
	componentWillMount: function () {
		this.map = null;
	},
	componentWillUnMount: function () {
		this.map = null;
	},
	componentDidMount: function () {
		var mapOptions = {
            center: this.mapCenterLatLng(
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude),
				zoom: this.props.initialZoom
        };		
        this.map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
		this.setState({ 
			map: this.map
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
				chekpointflag;
				
			startpoint = new google.maps.Circle(this.createPoint(
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude,
				'#31a354',
				'#a1d99b'				
			));
			
			startflag = new MarkerWithLabel({
				icon: " ",
				position: this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
											   this.props.challenge.startPosition.longitude),
				draggable: false,
				map: this.map,
				labelContent: "<i class='icon ion-ios7-flag start-flag'></i>",
				labelAnchor: new google.maps.Point(0, 32),
				labelClass: "labels", // the CSS class for the label
				labelStyle: {opacity: 0.75}
			});
						
			stoppoint = new google.maps.Circle(this.createPoint(
				this.props.challenge.stopPosition.latitude,
				this.props.challenge.stopPosition.longitude,
				'#2c7fb8',
				'#7fcdbb'
			));			
			
			stopflag = new MarkerWithLabel({
				icon: " ",
				position: this.mapCenterLatLng(this.props.challenge.stopPosition.latitude,
											   this.props.challenge.stopPosition.longitude),
				draggable: false,
				map: this.map,
				labelContent: "<i class='icon ion-ios7-flag stop-flag'></i>",
				labelAnchor: new google.maps.Point(0, 32),
				labelClass: "labels", // the CSS class for the label
				labelStyle: {opacity: 0.75}
			});			
			
			
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
					
					chekpointflag = new MarkerWithLabel({
						icon: " ",
						position: this.mapCenterLatLng(this.props.challenge.checkPoints[point].latitude,
													   this.props.challenge.checkPoints[point].longitude),
						draggable: false,
						map: this.map,
						labelContent: "<i class='icon ion-flag checkpoint-flag'></i>",
						labelAnchor: new google.maps.Point(0, 32),
						labelClass: "labels", // the CSS class for the label
						labelStyle: {opacity: 0.75}
					});						
				}
			}		
		}		
		return (		
			<div style={this.getBorderStyle()}>
				<div id='map' style={this.getStyle()}></div>
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