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
		this.lastLocation = null;
		this.checkPointsPassed = [];
		this.checkPointOrder = 0;
		this.status = 0;
		this.timeLeft = 0;
	},
	componentDidMount: function () {
		this.keepAlive();
	},
	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
	},
	render: function () {
		
		var totalkm = 0.0;	
		var buttonLabel = "GO TO START!";
		var inStart = false;		
		var inStop  = false;
		
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
						
						//Determine if route was successfully passed;
						if (this.checkPointsPassed.length < this.props.challenge.checkPoints.length) {
							console.log("challenge failed: not all checkpoint passed");
						}
						else if (_.contains(this.checkPointsPassed, false)) {
							console.log("challenge failed: Checkpoint(s) failed");
						}
						else {
							if (navigator) navigator.vibrate(3000);
							this.status = 1;
						}
					}
				}				
				
				//Check if checkpoints have been passed successfully
				var checkpoints = this.props.challenge.checkPoints;
			
				for (var j = this.checkPointOrder; j < checkpoints.length; j++) {

					if (this.pointInCircle(this.state.location.latitude, this.state.location.longitude, checkpoints[j].latitude, checkpoints[j].longitude)) {					
						if (Number(checkpoints[j].order) === Number(this.checkPointOrder + 1)) {						
							this.CheckPointCleared(Number(checkpoints[j].order));								
							//timeLeft should be calculated based on check
							if (this.props.challenge.type == 1)
							{
								this.timeLeft = Math.abs(Number(checkpoints[j].time)-Number(this.duration));
							}							
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
				if (this.lastLocation)
				{
					totalkm = this.gps_distance(this.lastLocation.latitude, this.lastLocation.longitude, this.state.location.latitude, this.state.location.longitude);
					this.totalKm = this.totalKm + Number(totalkm);
				}				
				this.lastLocation = this.state.location;				
			}
		}
	
		return (
			<View>
				<UI.Headerbar label="RUN" type="runopoly">
					{!this.state.ChallengeStarted ?
						<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" className="runopoly"/>	
					:
						null
					}
				</UI.Headerbar>
				<div style={this.getStyle()}>		
					<Tappable style={this.getKMStyle()}>
						<span style={this.getKMNumberStyle()}>{this.totalKm.toFixed(1)}</span>
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
						onTap={inStop ? this.stopChallenge : this.startChallenge}>{buttonLabel}
					</Tappable>
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
		if (this.state.ChallengeStarted) return;
				
		this.setState({
			challengeStarted: true
		});		
		
        this.intervalID = setInterval(this.tick, 1000);
    },
	// Stops tracking of a run
    stopChallenge: function () {		
	
		//this.setState({
		//	processing: true
		//});		
		console.log("stopChallenge");		
		clearInterval(this.intervalID);		
		this.saveResult();
		this.showView('page-home', 'fade', {});		
    },	
	saveResult: function() {

		var Challenge = Parse.Object.extend("Challenge");		
		//var User = Parse.Object.extend("User"); 		
		
		ParseReact.Mutation.Create('Results', {
			challenge: new Challenge({id: this.props.challenge.objectId}),
			status: this.status,
			timeLeft: this.timeLeft
			}).dispatch().then(function() {
				console.log("saved");
		});
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