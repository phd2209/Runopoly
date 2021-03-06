var React = require("react");
var Tappable = require('react-tappable');
var Parse = require('parse').Parse;
var UI = require('touchstonejs').UI;
var GoogleMap = require('../components/GoogleMap');
var View = require('../components/View');
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');
var _ = require('underscore');

var CreateStep2 = React.createClass({
	mixins: [geolocationMixin, Navigation],
	propTypes: {
		prevView: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		automatic: React.PropTypes.bool.isRequired
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
		this.duration = 0;
	},
	componentDidMount: function () {
		this.keepAlive();
	},
	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
	},
	componentDidUpdate: function () {
		if (this.props.automatic) {
		  if (this.checkPoints.length + 1 - this.totalKm <= 0.02) {
			  this.saveCheckPoint();
		  }
		}
	},
	render: function () {
		var totalkm = 0.0, lastState = null;
		if (this.state.tracking) {
			var addLocation = true;
			if (this.route.length) {			
				lastState = _.last(this.route);
				addLocation = this.state.location.latitude != lastState.latitude ||
							  this.state.location.longitude != lastState.longitude;
			}				
			if (addLocation) this.route.push(this.state.location);
			if (lastState)
			{
				totalkm = this.gps_distance(lastState.latitude, lastState.longitude, this.state.location.latitude, this.state.location.longitude);
				this.totalKm = this.totalKm + Number(totalkm);
			}
		}
		return (
			<View>
				<UI.Headerbar label={this.props.name} type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />
				</UI.Headerbar>
				<div style={this.getStyle()}>
					<Tappable style={this.getKMStyle()}>
						<span style={this.getKMNumberStyle()}>{this.totalKm.toFixed(1)}</span>
						<span style={this.getKMUnitStyle()}>Km</span>
					</Tappable>
					<GoogleMap 
						latitude={this.state.location.latitude} 
						longitude={this.state.location.longitude}
						tracking={this.state.tracking}
						checkPoint={this.state.checkPoint} />																 
					<Tappable 
						component="button"
						style={this.getButtonStyle()} 
						onTap={this.state.tracking ? this.stopTracking : this.startTracking}>{this.state.tracking ? 'STOP' : 'START'}
					</Tappable>
					{!this.props.automatic ?
						<Tappable
							className="checkpoint_button"
							component="button"
							disabled={!this.state.tracking && !this.state.checkPoint}
							style={this.getCheckPointButtonStyle()} 
							onTap={this.saveCheckPoint}>CheckPoint
						</Tappable> :
						null
					}
				</div>
			</View>
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
		//This add one to duration every second
		this.duration = this.duration + 1;
	},	
	startTracking: function () {		
		// Set tracking to true to store the gps coordinates in route array
		this.setState({
			tracking: true
		});				
		
		//Start the timer
		this.intervalID = setInterval(this.tick, 1000);

		//Create Start position
		this.startPosition = new Parse.GeoPoint(this.state.location.latitude, this.state.location.longitude);		
	},	
    stopTracking: function () {		
		//Stop the timer;
		clearInterval(this.intervalID);
		
		//stop position
		this.stopPosition = new Parse.GeoPoint(this.state.location.latitude, this.state.location.longitude);
		this.showView('page-create-step3', 'fade', {challenge: this.getChallenge()});
    },	
	saveCheckPoint: function() {	
		this.setState({
			checkPoint: true
		});	
		
		var count = this.checkPoints.length + 1;		
		this.checkPoints.push({
			order: count,
			latitude: this.state.location.latitude,
			longitude: this.state.location.longitude,
			time: this.duration,
			km: this.totalKm
		});
	},	
	getChallenge: function() {
		return challenge = new Object({
			name: this.props.name,
			startPosition: this.startPosition,
			stopPosition: this.stopPosition,
			route: this.route,
			criteria: "",
			stopTime: Number(this.duration),
			stopDistance: this.totalKm.toFixed(1),
			checkPoints: this.checkPoints			
		});
	},		
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
			/*backgroundColor: 'transparent'*/
			
		};	
	},
	getKMStyle: function () {
		return {
		  position:'absolute',
          top:'11%',
          color: '#039E79',
          backgroundColor: '#fff',
          padding: 5,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          width: '40%',
          left: 5,
          textAlign: 'center',
          textDecoration: 'none',
          margin: '0px auto',
		  zIndex: 999
		};		
	},
	getKMNumberStyle: function () {
		return {
          color: '#039E79',
		  fontSize: 30,
		  paddingRight: 3,
		  zIndex: 999
		};		
	},
	getKMUnitStyle: function () {
		return {
          color: '#ABD0CB',
		  fontSize: 15,
		  zIndex: 999
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
          margin: '0px auto',
		  textTransform: 'uppercase'
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
          margin: '0px auto',
		  textTransform: 'uppercase'
		};	
	},	
});
module.exports = CreateStep2;