var React = require("react");
var UI = require('touchstonejs').UI;

var ChallengeBingMap = React.createClass({
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},	
	getDefaultProps: function () {
        return {			
            initialZoom: 13,
        };
	},
	getInitialState: function () {
		return {
			map: null,
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
	mapLoaded: function() {
		this.setState({ 
			processing: false
		});
	},	
	componentDidMount: function () {	
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
		this.setState({ 
			map: this.map
		});
		this.attachmapviewchangeend = Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', self.mapLoaded);
	},		
	render: function () {
		
		if (this.state.map) {
			
			this.state.map.setView(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude));

			var coordinates = [];
			for (var point in this.props.challenge.route) {
				coordinates.push(this.mapCenterLatLng(this.props.challenge.route[point].latitude, this.props.challenge.route[point].longitude));
			}
			
			var polyline = new Microsoft.Maps.Polyline(coordinates, null); 
			this.state.map.entities.push(polyline);

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
					{ fillColor: new Microsoft.Maps.Color(30, 100, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 100, 0, 0), strokeThickness: 1 });
			this.state.map.entities.push(startpoint);
			
			//Start flag
			var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-ios-flag start-flag'></i>"}; 
			startflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.startPosition.latitude,
				this.props.challenge.startPosition.longitude), pushpinOptions);
			this.state.map.entities.push(startflag);
			
			//Stop Circle
			var locationCircleOptions = this.drawCircle(this.props.challenge.stopPosition.latitude, this.props.challenge.stopPosition.longitude);
			stoppoint = new Microsoft.Maps.Polygon(locationCircleOptions,
					{ fillColor: new Microsoft.Maps.Color(30, 100, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 100, 0, 0), strokeThickness: 1 });
			this.state.map.entities.push(stoppoint)

			//Stop Flag
			var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-ios-flag stop-flag'></i>"}; 
			stopflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.stopPosition.latitude,
				this.props.challenge.stopPosition.longitude), pushpinOptions);
			this.state.map.entities.push(stopflag);
			
			if (this.props.challenge.checkPoints)
			{
				for (var point in this.props.challenge.checkPoints)
				{	

					var locationCircleOptions = this.drawCircle(this.props.challenge.checkPoints[point].latitude, this.props.challenge.checkPoints[point].longitude);
					checkpoint = new Microsoft.Maps.Polygon(locationCircleOptions,
					{ fillColor: new Microsoft.Maps.Color(30, 100, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 100, 0, 0), strokeThickness: 1 });
					this.state.map.entities.push(checkpoint)
			
					//Stop Flag
					var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-flag checkpoint-flag'></i>"}; 
					chekpointflag = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.checkPoints[point].latitude,
					this.props.challenge.checkPoints[point].longitude), pushpinOptions);
					this.state.map.entities.push(chekpointflag);						
										
					var number = this.props.challenge.checkPoints[point].order;
					var pushpinOptions = {width: 0, height: 16, htmlContent: "<h3>"+number+"</h3>"};					
					var chekpointnumber = new Microsoft.Maps.Pushpin(this.mapCenterLatLng(this.props.challenge.checkPoints[point].latitude,
						this.props.challenge.checkPoints[point].longitude), pushpinOptions);
					this.state.map.entities.push(chekpointnumber);						
				}
			}
		};				
		return (
			<div style={this.getBorderStyle()}> 
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
    mapCenterLatLng: function (latitude, longitude) {
		return new Microsoft.Maps.Location(latitude, longitude);
    },	
	drawCircle: function (latitude, longitude) {
		var R = 6371;
		var radius = 0.05;
		var d = parseFloat(radius) / R;
		
		var backgroundColor = new Microsoft.Maps.Color(10, 100, 0, 0);
		var borderColor = new Microsoft.Maps.Color(150, 200, 0, 0);
		
		var lat = (latitude * Math.PI) / 180;     
		var lon = (longitude * Math.PI) / 180;
		
		var circlePoints = new Array();
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
			height: 300,
			position: 'relative'
		};	
	},
});
module.exports = ChallengeBingMap;