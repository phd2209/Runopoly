var React = require("react");
var Tappable = require('react-tappable');
var Parse = require('parse').Parse;
var UI = require('touchstonejs').UI;
var GoogleMap = require('../components/GoogleMap');
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');
var _ = require('underscore');

var CreateStep2 = React.createClass({
	mixins: [geolocationMixin, Navigation],	
	propTypes: {
		prevView: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		type: React.PropTypes.number.isRequired,
		difficulty: React.PropTypes.number.isRequired
	},		
	getDefaultProps: function () {
        return {
			prevView: 'page-create-step1',
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },
	getInitialState: function () {
		return {
			tracking: false,
			location: {latitude: 0, longitude: 0},
			duration: 0,
			processing: false,
			checkPoint: false
		};
	},
	componentWillMount: function () {
		this.watchPosition();
		this.startPosition = null;
		this.stopPosition = null;
		this.route = [];
		this.totalKm = 0;
		this.checkPoints = [];
	},
	componentDidMount: function () {
		this.keepAlive();
	},		
	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
	},	
	render: function () {
		var totalkm = 0;	

		if (this.state.tracking) {
			
			var lastState = null;
			var addLocation = true;
			if (this.route.length) {
				var lastState = _.last(this.route);
				addLocation = this.state.location.latitude != lastState.latitude ||
							  this.state.location.longitude != lastState.longitude;
			}				
			if (addLocation) this.route.push(this.state.location);
		}
		
		for (var j = 0; j < this.route.length; j++) {

			if (j == (this.route.length - 1)) {
				break;
			}			
			totalkm += this.gps_distance(this.route[j].latitude, this.route[j].longitude, this.route[j + 1].latitude, this.route[j + 1].longitude);												
		}
	
		totalkm = totalkm.toFixed(2);
		this.totalKm = Number(totalkm);

		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="STEP2" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />				
				</UI.Headerbar>		
				<div style={this.getStyle()}>				
					<GoogleMap 
					latitude={this.state.location.latitude} 
					longitude={this.state.location.longitude}
					tracking={this.state.tracking}
					checkPoint={this.state.checkPoint}
					/>
					<Tappable style={this.getButtonStyle()} onTap={this.state.tracking ? this.stopTracking : this.startTracking}>{this.state.tracking ? 'STOP' : 'START'}</Tappable>
					<Tappable style={this.getCheckPointButtonStyle()} onTap={this.saveCheckPoint}>Create CheckPoint</Tappable>
				</div>
			</UI.FlexLayout>
		);
	},
	// Phonegap extension 
	// - prevent device from sleeping
	// - allow device to sleep
    keepAlive: function () {
        if (window.plugins)
            window.plugins.insomnia.keepAwake();
    },
    allowSleep: function () {
        if (window.plugins)
            window.plugins.insomnia.allowSleepAgain();
    },	
	// Calculate distance of route
	// and duration
    gps_distance: function (lat1, lon1, lat2, lon2) {
        // http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // km
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var lat1 = lat1 * (Math.PI / 180);
        var lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },	
	tick: function() {	
		this.setState({ 
			duration: this.state.duration + 1
		});
	},	
    //Starts actual tracking of a Run    
	startTracking: function () {		
		console.log("Start capturing route");
		
		// Set tracking to true to store the gps coordinates in route array
		this.setState({
			tracking: true
		});				
		
		//Start a timer if it is a time trial
		if (this.props.type == 1){
			this.intervalID = setInterval(this.tick, 1000);
		}
		
		//Create Start position
		this.startPosition = new Parse.GeoPoint(this.state.location.latitude, this.state.location.longitude);
		
	},	
	// Stops tracking of a run
    stopTracking: function () {		
		console.log("Stop capturing route");
		
		this.setState({
			processing: true
		});
		
		//Stop the timer if it is a time trial;
		if (this.props.type === 1){
			clearInterval(this.intervalID);
		}
		
		//stop position
		this.stopPosition = new Parse.GeoPoint(this.state.location.latitude, this.state.location.longitude);

		this.setState({
			processing: false
		});
		
		setTimeout(function() {
			this.showView('page-create-step3', 'fade', {challenge: this.getChallenge()});
		}.bind(this), 0);					
    },	
	saveCheckPoint: function() {	
		this.setState({
			checkPoint: true
		});	
		
		var count = this.checkPoints.length + 1;		
		if (this.props.type === 1){
			this.checkPoints.push({
				order: count,
				latitude: this.state.location.latitude,
				longitude: this.state.location.longitude,
				time: this.state.duration,
				km: this.totalKm
			});
		}
		else {
			this.checkPoints.push({
				order: count,
				latitude: this.state.location.latitude,
				longitude: this.state.location.longitude,
				km: this.totalKm
			});			
		}
	},	
	getChallenge: function() {
		
		if (this.props.type === 1) {		
			return challenge = new Object({
				name: this.props.name,
				type: this.props.type,
				difficulty: this.props.difficulty,
				startPosition: this.startPosition,
				stopPosition: this.stopPosition,
				route: this.route,
				criteria: "",
				stopTime: Number(this.state.duration),
				stopDistance: this.totalKm,
				checkPoints: this.checkPoints			
			});
		}
		else {
			return challenge = new Object({
				name: this.props.name,
				type: this.props.type,
				difficulty: this.props.difficulty,
				startPosition: this.startPosition,
				stopPosition: this.stopPosition,
				route: this.route,
				criteria: "",
				stopDistance: this.totalKm,
				checkPoints: this.checkPoints			
			});			
		}
	},		
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	},
	getButtonStyle: function () {
		
		var color = this.state.tracking ? 'red' : 'green' ;
		
		return {
		  position:'absolute',
          bottom:'2%',
          color: '#fff',
          backgroundColor: color,
          padding: 11,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
          textDecoration: 'none',
          margin: '0px auto'
		};	
	},	
	getCheckPointButtonStyle: function () {
		return {
		  position:'absolute',
          bottom:'13%',
          color: '#fff',
          backgroundColor: '#4d90fe',
          padding: 11,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
          textDecoration: 'none',
          margin: '0px auto'
		};	
	},	
});

module.exports = CreateStep2;