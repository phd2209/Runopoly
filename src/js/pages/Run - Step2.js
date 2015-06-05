var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var ChallengeMap = require('../components/ChallengeMap');
var geolocationMixin = require('../mixins/geoLocationMixin');
var Link = require('touchstonejs').Link;
var Tappable = require('react-tappable');

var RunStep2 = React.createClass({
	mixins: [geolocationMixin, Navigation, ParseReact.Mixin],	
	propTypes: {	
		selectedChallengeId: React.PropTypes.string.isRequired
	},	
	getDefaultProps: function () {
        return {
			prevView: 'page-run-step1',
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },
	getInitialState: function () {
		return {
			atStartPosition: false,
			location: {latitude: 0, longitude: 0},
		};
	},
	componentWillMount: function () {
		this.watchPosition();
	},
	componentDidMount: function () {
		this.keepAlive();
	},
	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
	},	
	observe: function() {
		return {
			challenge: (new Parse.Query('Challenge'))
			.equalTo("objectId", this.props.selectedChallengeId) /*,
			user: ParseReact.currentUser*/
		};
	},
	render: function () {	
		var inStart = false;
		var distanceToPoint = 0;
		if (this.state.location.latitude && this.data.challenge[0])
		{
			console.log(this.data.challenge[0].startPosition.latitude);
			console.log(this.data.challenge[0].startPosition.longitude);
			distanceToPoint = this.gps_distance(this.state.location.latitude, this.state.location.longitude, 
				this.data.challenge[0].startPosition.latitude, this.data.challenge[0].startPosition.longitude);
			distanceToPoint = (distanceToPoint*1000).toFixed(0);
			
			if (this.pointInCircle(distanceToPoint)) 
			{
				inStart = true;
			}				
		}
		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="CHALLENGE" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />			
				</UI.Headerbar>
				<UI.FlexBlock>
					<div className="Panel">
						{this.data.challenge[0] ?
							<div className="item-inner">							 
								<span style={this.getInfoItemStyle()}>{this.data.challenge[0].stopDistance} Km</span>
								<span style={this.getInfoItemStyle()}>{this.getType(this.data.challenge[0].type)}</span>
								<span style={this.getInfoItemStyle()}>{this.getDifficulty(this.data.challenge[0].difficulty)}</span>								
							</div>
							: null 
						}
					</div>
					{this.data.challenge[0] ? 
					<ChallengeMap
						challenge={this.data.challenge[0]}
						height={350}
						location={this.state.location}
					/>
					: null}
					<span style={this.getInfoItemStyle()}>{distanceToPoint} Meters</span>
					<Tappable disable={inStart} onTap={this.startChallenge} className="panel-button" component="button">
						{inStart ?
							"You are Ready to Start" : 
							"You are not quite there"
						}
					</Tappable>
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />
			</UI.FlexLayout>	
		);
	},
	startChallenge: function () {
		
		this.showView('page-run-step3', 'fade', {challenge: this.data.challenge[0]});
	},
	pointInCircle: function (distanceToPoint) {
		var result = 0;		
		if (distanceToPoint<50) result = 1;
		return result;
	},
	//Checks if a given position is located within a ellipse
    pointInEllipse: function (latitude, longitude, point) {
		
		console.log(latitude);
		console.log(longitude);
		console.log(point);

		var rotation = 0;
		var radius = 50;
		var result = 0;

        // Set up "Constants"
        var m1 = 111132.92;		// latitude calculation term 1
        var m2 = -559.82;		// latitude calculation term 2
        var m3 = 1.175;			// latitude calculation term 3
        var m4 = -0.0023;		// latitude calculation term 4
        var p1 = 111412.84;		// longitude calculation term 1
        var p2 = -93.5;			// longitude calculation term 2
        var p3 = 0.118;			// longitude calculation term 3

        var latlen = m1 + (m2 * Math.cos(2 * latitude)) + (m3 * Math.cos(4 * latitude)) +
                (m4 * Math.cos(6 * latitude));
        var longlen = (p1 * Math.cos(latitude)) + (p2 * Math.cos(3 * latitude)) +
                    (p3 * Math.cos(5 * latitude));

        //Handle rotation of ellipse
        var cosa = Math.cos(rotation);
        var sina = Math.sin(rotation);
		console.log(cosa);
		console.log(sina);
        // Normalized latitude and longitude in meters
        var dLat = (point.latitude - latitude) * latlen; //111111;
        var dLon = (point.longitude - longitude) * longlen; //63994;

        console.log("Latlen: " + dLat);
        console.log("Longlen: " + dLon);
        //Taken from the formula of the rotated ellipse
        var a = Math.pow(cosa * dLon + sina * dLat, 2);
        var b = Math.pow(sina * dLon - cosa * dLat, 2);


        //We need the  radius squred according to the formula of the ellipse
        var radius = radius * radius;
		console.log(radius);
		console.log(a);
		console.log(b);
        //Rotated ellipse formula - less than or equal to one inside ellipse
        var ellipse = (a / radius) + (b / radius);
        console.log("ellipse: " + ellipse);

        if (ellipse != undefined && ellipse <= 1) result = 1;

        console.log("Result: " + result);
        return result;
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
	getType: function (typeno) {
		if (typeno === 1) return "Time trial";
		return "Timeless trial";			
	},
	getDifficulty: function (difficultyno) {
		if (difficultyno === 1) return "Easy";
		else if (difficultyno === 2) return "Moderate";
		return "Hard";				
	},
	getInfoItemStyle: function () {
		return {
		  color: '#039E79',
          backgroundColor: '#fff',
          padding: 5,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          textAlign: 'center',
          textDecoration: 'none'
		};		
	},
	getButtonStyle: function () {
		return {
		  position:'absolute',
          bottom:'2%',
          color: '#fff',
          backgroundColor: '#42B49A',
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
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	}	
});
module.exports = RunStep2;