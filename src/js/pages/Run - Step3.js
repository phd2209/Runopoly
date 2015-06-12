var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Tappable = require('react-tappable');
var ChallengeMap = require('../components/ChallengeMap');
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var RunStep3 = React.createClass({
	mixins: [geolocationMixin, Navigation],
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},
	getDefaultProps: function () {
        return {
			prevView: 'page-run-step2',
			maximumAge: 4000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },
	getInitialState: function () {
		return {
			ChallengeStarted: false,
			location: null,
			processing: false
		};
	},
	componentWillMount: function () {
		this.watchPosition();
		this.duration = 0;
		this.totalKm = 0;
		this.route = [];
		this.checkPointsPassed = [];
		this.checkPointOrder = 0;
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
		this.duration = this.duration + 1;
	},	
    //Starts actual tracking of a Run    
	startChallenge: function () {		
		console.log("Challenge started");
		
		if (this.state.ChallengeStarted)
		{
			this.setState({
				ChallengeStarted: false
			});			
			clearInterval(this.intervalID);
			return;
		}
		
		this.setState({
			challengeStarted: true
		});		
        this.intervalID = setInterval(this.tick, 1000);
    },
	// Stops tracking of a run
    stopChallenge: function () {		
	
		this.setState({
			processing: true
		});
	
		console.log("stopTracking" +this.state.ChallengeStarted);
		
		clearInterval(this.intervalID);
		
		//Save run
		this.saveResult();
		
		//reset state		
		this.setState({
			ChallengeStarted: false,
			location: {latitude: 0, longitude: 0},
		});
		
		this.areaKm = 0;
		this.totalKm = 0;
		
		//setTimeout(function() {
		//	this.showView('page-areaowners', 'fade', {selectedAreaId: this.props.selectedAreaId});
		//}.bind(this), 0);					
    },	
	saveResult: function() {
		
		// ACL, so that only the current user can access this object
		/*
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
	*/
	},				
	render: function () {
		
		var totalkm = 0.0;	
		var buttonLabel = "GO TO START!";
		var inStart = false;
		
		var inStop  = false;
		var distanceToPoint = 0;
		
		if (this.state.location)
		{
			//Check that user is in the start zone
			if (!this.state.challengeStarted)
			{
				var startposition = this.props.challenge.startPosition;
				if (this.pointInCircle(this.state.location.latitude, this.state.location.longitude, startposition.latitude, startposition.longitude)) 
				{
					buttonLabel = "START";
					inStart = true;
				}				
			}
			
			// if challenge is started check if we are in the right checkpoint
			else {				
				
				buttonLabel = "RUNNING";
				
				//Make sure that at least one checkpoint has been passed before you are at stopPosition
				if (this.checkPointOrder > 0) {
					var stopposition = this.props.challenge.stopPosition;
					
					if (this.pointInCircle(this.state.location.latitude, this.state.location.longitude, stopposition.latitude, stopposition.longitude)) 
					{
						buttonLabel = "FINISH";
						inStop = true;
						console.log(this.checkPointsPassed)
											
						//Determine if route was successfully passed;
						if (this.checkPointsPassed.length < this.props.challenge.checkPoints.length) {
							console.log("challenge failed: not all checkpoint passed");
						}
						else if (_.contains(this.checkPointsPassed, false)) {
							console.log("challenge failed: Checkpoint(s) failed");
						}
						else {
							if (navigator) navigator.vibrate(3000);
							console.log("challenge passed");					
						}
					}
				}				
				
				//Check if checkpoints have been passed successfully
				var checkpoints = this.props.challenge.checkPoints;
			
				for (var j = this.checkPointOrder; j < checkpoints.length; j++) {

					if (this.pointInCircle(this.state.location.latitude, this.state.location.longitude, checkpoints[j].latitude, checkpoints[j].longitude)) {					
						if (Number(checkpoints[j].order) === Number(this.checkPointOrder + 1)) {															
							this.CheckPointCleared(Number(checkpoints[j].order));
							if (navigator) navigator.vibrate(3000);
							break;
						}
						else if (Number(checkpoints[j].order) < Number(this.checkPointOrder + 1))
							break;
						else {
							this.CheckPointsFailed(Number(checkpoints[j].order));
							break;
						}
					}
				}
				
				//Calculate totalKm			
				var lastState = null;
				var addLocation = true;
				if (this.route.length) {
				
					//Can an optimazation be done so we dont need to user _last?;
					var lastState = _.last(this.route);
					addLocation = this.state.location.latitude != lastState.latitude ||
								  this.state.location.longitude != lastState.longitude;
				}				
				if (addLocation) this.route.push(this.state.location);
				
				// Can an optimization be done so that we don't need to loop through all route items?;
				for (var j = 0; j < this.route.length; j++) {

					if (j == (this.route.length - 1)) {
						break;
					}			
					totalkm += this.gps_distance(this.route[j].latitude, this.route[j].longitude, this.route[j + 1].latitude, this.route[j + 1].longitude);												
				}		
				totalkm = totalkm.toFixed(1);
				this.totalKm = Number(totalkm);					
			}
		}
		/*
		<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length || this.state.processing} className="Modal-loading" />
		<div style={this.getRunTimerStyle()}><RunTimer duration={this.duration} /></div>
		<div style={this.getRunDisplayStyle()}><RunDisplay totalKm={totalkm} color="#43494B" fontsize={35}/></div>
		*/		
		return (
			<View>
				<UI.Headerbar label="RUN" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" className="runopoly"/>	
				</UI.Headerbar>
				<div style={this.getStyle()}>		
					<Tappable style={this.getKMStyle()}>
						<span style={this.getKMNumberStyle()}>{totalkm}</span>
						<span style={this.getKMUnitStyle()}>Km</span>
					</Tappable>				
					<ChallengeMap
						challenge={this.props.challenge}
						initialZoom={17}
						location={this.state.location}
						height="100%"
						position="absolute"
						challengeStarted={this.state.challengeStarted}
					/>						
					<Tappable
						className="checkpoint_button"
						component="button"
						disabled={!inStart && !this.state.ChallengeStarted && !inStop}
						style={this.getButtonStyle()} 
						onTap={this.startChallenge}>{buttonLabel}
					</Tappable>
				</div>
			</View>
		);
	},
	pointInCircle: function (lat1, lon1, lat2, lon2) {		
		var result = false;		
		var distanceToPoint = (this.gps_distance(lat1, lon1, lat2, lon2)*1000).toFixed(0);
		if (distanceToPoint<25) result = true;
		return result;
	},
	CheckPointCleared: function (index) {		
		console.log("passed " + index);
		if (this.checkPointsPassed.length < index) {
			this.checkPointsPassed[index-1] = true;	
			this.checkPointOrder = this.checkPointOrder + 1;
		}
	},
	CheckPointsFailed: function (index) {
		console.log("Failed " + index);
		if (this.checkPointsPassed.length >= index) return;
		this.checkPointsPassed[index-1] = false;
		this.checkPointOrder = this.checkPointOrder + 1;
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
          margin: '0px auto',
		  textTransform: 'uppercase'
		};	
	},	
	getRunTimerStyle: function () {
		return {
		  position:'absolute',
          top:'11%',
          /*color: '#039E79',*/
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
	getRunDisplayStyle: function () {
		return {
		  position:'absolute',
          top:'11%',
          /*color: '#039E79',*/
          backgroundColor: '#fff',
          padding: 5,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          width: '30%',
          right: 5,
          textAlign: 'center',
          textDecoration: 'none',
          margin: '0px auto',
		  zIndex: 999
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
          width: '30%',
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
		  fontSize: 20,
		  paddingRight: 3,
		  zIndex: 999
		};		
	},
	getKMUnitStyle: function () {
		return {
          color: '#ABD0CB',
		  fontSize: 12,
		  zIndex: 999
		};		
	},
});

module.exports = RunStep3;