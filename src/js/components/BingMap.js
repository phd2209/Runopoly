var React = require("react");
var UI = require('touchstonejs').UI;

var BingMap = React.createClass({
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
		if (typeof (this.map) != 'undefined' && this.map != null) 
		{ 
			this.map.dispose(); 
			this.map = null; 
		} 
		this.coordinates = [];		
	},
	componentWillUnMount: function () {
		Microsoft.Maps.Events.removeHandler(this.attachmapviewchangeend);
		if (typeof (this.map) != 'undefined' && this.map != null) 
		{ 
			this.map.dispose(); 
			this.map = null; 
		} 
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
			credentials: "AuAHBbCwL3pG2rjo0Pb_O4wjIKHzdKQLIUGMndhAaXZUv9d7Oa_JyamaDkNrnuQd",
			mapTypeId: Microsoft.Maps.MapTypeId.road,
			center: this.mapCenterLatLng(),
			zoom: this.props.initialZoom,
			disableKeyboardInput: true
		};
		this.map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
		this.attachmapviewchangeend = Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', self.mapLoaded);
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
			this.map.setView({ center: this.mapCenterLatLng() });
			
			if (this.locationCircle) {				
				this.locationCircle.setLocations(this.drawCircle(this.props.latitude, this.props.longitude));	
			}
			else {
				var locationCircleOptions = this.drawCircle(this.props.latitude, this.props.longitude);
				this.locationCircle = new Microsoft.Maps.Polygon(locationCircleOptions,
					{ fillColor: new Microsoft.Maps.Color(30, 100, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 100, 0, 0), strokeThickness: 1 });
				this.map.entities.push(this.locationCircle);				
			}	
		}
		
		if (this.props.tracking) {
			
			if (!this.coordinates.length)
			{
				var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-ios-flag start-flag'></i>"}; 
				var pushpin= new Microsoft.Maps.Pushpin(this.map.getCenter(), pushpinOptions);
				this.map.entities.push(pushpin);				
			}
			
			this.coordinates.push(this.mapCenterLatLng());
	
			var polyline = new Microsoft.Maps.Polyline(this.coordinates, null); 
			this.map.entities.push(polyline);
	
			if (this.props.checkPoint)
			{
				var checkPointOptions = this.drawCircle(this.props.latitude, this.props.longitude);
				var checkPointPolygon = new Microsoft.Maps.Polygon(checkPointOptions,
					{ fillColor: new Microsoft.Maps.Color(30, 100, 0, 0), strokeColor: new Microsoft.Maps.Color(90, 100, 0, 0), strokeThickness: 1 });
				var pushpinOptions = {width: 0, height: 32, htmlContent: "<i class='icon ion-flag checkpoint-flag'></i>"}; 
				var pushpin= new Microsoft.Maps.Pushpin(this.map.getCenter(), pushpinOptions);
				this.map.entities.push(pushpin);
				this.map.entities.push(checkPointPolygon);
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
    mapCenterLatLng: function () {
		return new Microsoft.Maps.Location(this.props.latitude, this.props.longitude);
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
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	},
});
module.exports = BingMap;