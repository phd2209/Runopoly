var React = require("react");
var UI = require('touchstonejs').UI;

var ChallengeBingMap = React.createClass({
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
			radius: 50,
			checkPoint: false
        };
	},
	getInitialState: function () {
		return {
			processing: true
		};
	},	
	componentWillMount: function () {
		if (typeof (this.map) != 'undefined' && this.map != null) 
		{ 
			this.map.dispose(); 
			this.map = null; 
		} 	
	},
	componentWillUnMount: function () {
		Microsoft.Maps.Events.removeHandler(this.attachmapviewchangeend);
		if (typeof (this.map) != 'undefined' && this.map != null) 
		{ 
			this.map.dispose(); 
			this.map = null; 
		} 
	},	
	componentDidMount: function () {
		this.userCircle = null;		
		var self = this;
		var mapOptions = {
			credentials: "AuAHBbCwL3pG2rjo0Pb_O4wjIKHzdKQLIUGMndhAaXZUv9d7Oa_JyamaDkNrnuQd",
			mapTypeId: Microsoft.Maps.MapTypeId.road,
			center: this.mapCenterLatLng(
				this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude),
			zoom: this.props.initialZoom,
			disableKeyboardInput: true,
			showDashboard: false
		};
		this.map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
		this.attachmapviewchangeend = Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', self.mapLoaded);
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
			if (!this.props.challengeStarted)
			{
				this.map.setView(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
					this.props.challenge.startPosition.longitude));				
			}
			else {
				this.map.setView(this.mapCenterLatLng(this.props.latitude,
					this.props.longitude));				
			}			
		
			if (this.userCircle) {
				this.userCircle.setLocations(this.drawCircle(this.props.latitude, this.props.longitude));	
			}
			else {
				var userCircleOptions = this.drawCircle(this.props.latitude, this.props.longitude, this.props.radius);
				this.userCircle = new Microsoft.Maps.Polygon(userCircleOptions,
					{ fillColor: new Microsoft.Maps.Color(50, 255, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 255, 0, 0), strokeThickness: 1 });
				this.map.entities.push(this.userCircle);				
			}
			
			if (this.props.checkPoint)
			{
				var pushpinOptions = {width: 0, height: -15, htmlContent: "<i class='icon ion-ios-checkmark  start-flag'></i>"}; 
				var pushpin= new Microsoft.Maps.Pushpin(this.map.getCenter(), pushpinOptions);
				this.map.entities.push(pushpin);
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
			
		var polyline = new Microsoft.Maps.Polyline(coordinates, {strokeColor: new Microsoft.Maps.Color(75, 255, 0, 0), strokeThickness:2}); 
		this.map.entities.push(polyline);

		var startpoint,
			startflag,
			stoppoint,
			stopflag,
			checkpoint,
			chekpointflag,
			checkpointorder;
			
		//Start circle
		var locationCircleOptions = this.drawCircle(this.props.challenge.startPosition.latitude, this.props.challenge.startPosition.longitude);
		startpoint = new Microsoft.Maps.Polygon(locationCircleOptions,
				{ fillColor: new Microsoft.Maps.Color(40, 49, 163, 84), strokeColor: new Microsoft.Maps.Color(75, 49, 163, 84), strokeThickness: 2 });
		this.map.entities.push(startpoint);
		
		//Start flag
		var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-ios-flag start-flag'></i>"}; 
		startflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
			this.props.challenge.startPosition.longitude), pushpinOptions);
		this.map.entities.push(startflag);
		
		//Stop Circle
		var locationCircleOptions = this.drawCircle(this.props.challenge.stopPosition.latitude, this.props.challenge.stopPosition.longitude);
		stoppoint = new Microsoft.Maps.Polygon(locationCircleOptions,
				{ fillColor: new Microsoft.Maps.Color(40, 44, 127, 184), strokeColor: new Microsoft.Maps.Color(75, 44, 127, 184), strokeThickness: 2 });
		this.map.entities.push(stoppoint)

		//Stop Flag
		var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-ios-flag stop-flag'></i>"}; 
		stopflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.stopPosition.latitude,
			this.props.challenge.stopPosition.longitude), pushpinOptions);
		this.map.entities.push(stopflag);
		
		if (this.props.challenge.checkPoints)
		{
			for (var point in this.props.challenge.checkPoints)
			{	

				var locationCircleOptions = this.drawCircle(this.props.challenge.checkPoints[point].latitude, this.props.challenge.checkPoints[point].longitude);
				checkpoint = new Microsoft.Maps.Polygon(locationCircleOptions,
				{ fillColor: new Microsoft.Maps.Color(40, 230, 85, 13), strokeColor: new Microsoft.Maps.Color(75, 230, 85, 13), strokeThickness: 2 });
				this.map.entities.push(checkpoint)
		
				//Stop Flag
				var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-flag checkpoint-flag'></i>"}; 
				chekpointflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.checkPoints[point].latitude,
				this.props.challenge.checkPoints[point].longitude), pushpinOptions);
				this.map.entities.push(chekpointflag);						
									
				var number = this.props.challenge.checkPoints[point].order;
				var pushpinOptions = {width: 0, height: 16, htmlContent: "<h3 class='checkpoint-number'>"+number+"</h3>"};					
				var chekpointnumber = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.checkPoints[point].latitude,
					this.props.challenge.checkPoints[point].longitude), pushpinOptions);
				this.map.entities.push(chekpointnumber);						
			}
		}
	},				
    mapCenterLatLng: function (latitude, longitude) {
		return new Microsoft.Maps.Location(latitude, longitude);
    },	
	drawCircle: function (latitude, longitude) {
		//constants
		var R = 6371;
		var radius = Number(this.props.radius/1000);
		var circlePoints = new Array();
		
		var d = parseFloat(radius) / R;		
		var lat = (latitude * Math.PI) / 180;     
		var lon = (longitude * Math.PI) / 180;
				
		for (x = 0; x <= 360; x += 5) {
			var p2 = new Microsoft.Maps.Location(0, 0);
			brng = x * Math.PI / 180;
			p2.latitude = Math.asin(Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(brng));
			p2.longitude = ((lon + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat), 
                     Math.cos(d) - Math.sin(lat) * Math.sin(p2.latitude))) * 180) / Math.PI;
            p2.latitude = (p2.latitude * 180) / Math.PI;
            circlePoints.push(p2);	
		}
		return circlePoints;
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
module.exports = ChallengeBingMap;