var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var RunTimer = require("../components/RunTimer");
var RunDisplay = require("../components/RunDisplay");
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Tappable = require('react-tappable');
var ChallengeMap = require('../components/ChallengeMap');
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var RunningPage = React.createClass({
	mixins: [geolocationMixin, Navigation],
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},
	getDefaultProps: function () {
        return {
			prevView: 'page-run-step2',
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
			processing: false
		};
	},
	componentWillMount: function () {
		this.watchPosition();
		this.totalKm = 0;
		this.duration = 0;
	},
	componentDidMount: function () {
		this.keepAlive();
	},
	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
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
		var self = this;
		this.setState({ 
			duration: this.state.duration + 1
		});
	},	
    //Starts actual tracking of a Run    
	startChallenge: function () {		
		console.log("Challenge started");
		
		if (this.state.tracking)
		{
			this.setState({
				tracking: false
			});			
			clearInterval(this.intervalID);
			return;
		}
		
		this.setState({
				tracking: true
		});
		
        this.intervalID = setInterval(this.tick, 1000);
    },
	// Stops tracking of a run
    stopTracking: function () {		
	
		this.setState({
			processing: true
		});
	
		console.log("stopTracking" +this.state.tracking);
		
		clearInterval(this.intervalID);
		
		//Save run
		this.saveRun();
		
		//reset state		
		this.setState({
			tracking: false,
			duration: 0,
			location: {latitude: 0, longitude: 0},
		});
		
		this.areaKm = 0;
		this.totalKm = 0;
		
		setTimeout(function() {
			this.showView('page-areaowners', 'fade', {selectedAreaId: this.props.selectedAreaId});
		}.bind(this), 0);			
		
    },
	
	saveRun: function() {
		
		// ACL, so that only the current user can access this object
		var Area = Parse.Object.extend("Area");		
		var User = Parse.Object.extend("User"); 		
		var acl = new Parse.ACL(new User({id: this.data.user.objectId}));
		acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
		
		console.log(this.data.user);	
		ParseReact.Mutation.Create('Run', {
			areaKm: Number(this.areaKm),
			totalKm: Number(this.totalKm),
			duration: Number(this.state.duration),
			route: this.tracking_data,
			area: new Area({id: this.props.selectedAreaId}),
			user: new User({id: this.data.user.objectId}),
			ACL: acl
		}).dispatch().then(function() {
			areaKm = 0;
			totalKm = 0;
			duration = 0;
			route = [];
			area = null,
			user = null,
			ACL = null;
		});
	},				
	render: function () {
		var totalkm = 0.0;	
		var inStart = false;
		var distanceToPoint = 0;
		if (this.state.location.latitude)
		{
			console.log(this.data.challenge.startPosition.latitude);
			console.log(this.data.challenge.startPosition.longitude);
			distanceToPoint = this.gps_distance(this.state.location.latitude, this.state.location.longitude, 
				this.data.challenge.startPosition.latitude, this.data.challenge.startPosition.longitude);
			distanceToPoint = (distanceToPoint*1000).toFixed(0);
			
			if (this.pointInCircle(distanceToPoint)) 
			{
				inStart = true;
			}				
		}		
		
		if (this.state.tracking) {				
			// Can an optimization be done so that we don't need to loop through all route items?;
			for (var j = 0; j < this.route.length; j++) {

				if (j == (this.route.length - 1)) {
					break;
				}			
				totalkm += this.gps_distance(this.route[j].latitude, this.route[j].longitude, this.route[j + 1].latitude, this.route[j + 1].longitude);												
			}
		
			totalkm = totalkm.toFixed(2);
			this.totalKm = Number(totalkm);			
		
		}

		/*
		<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length || this.state.processing} className="Modal-loading" />
		*/		
		return (
			<View>
				<UI.Headerbar label="RUN" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" className="runopoly"/>	
				</UI.Headerbar>
				<div style={this.getStyle()}>
					<div className='action-button'><RunTimer duration={this.state.duration} /></div>
					<div className='action-button'><RunDisplay totalKm={totalkm} color="#43494B"  fontsize={35}/></div>
					<ChallengeMap
						challenge={this.props.challenge}
						initialZoom={15}
						height="100%"
					/>						
					<Tappable
						className="checkpoint_button"
						component="button"
						disabled={!this.state.tracking}
						style={this.getButtonStyle()} 
						onTap={this.saveCheckPoint}>{this.state.tracking ? "START" : "NOT READY" }
					</Tappable>
				</div>
			</View>
		);
	},
	pointInCircle: function (distanceToPoint) {
		var result = false;		
		if (distanceToPoint<50) result = true;
		return result;
	},
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
			/*backgroundColor: 'transparent'*/
			
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
});

module.exports = RunningPage;