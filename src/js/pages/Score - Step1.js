var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Navigation = require('touchstonejs').Navigation;
var _ = require('underscore');

var ScoreStep1 = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],
	getDefaultProps: function () {
        return {
			prevView: 'page-home', 
		};
    },
	getInitialState: function () {
		return {
			processing: true
		};
	},	
	observe: function(props, state) {
		return {
			results: (new Parse.Query('Results').include('challenge')),
			challenges: (new Parse.Query('Challenge'))/*,
			user: ParseReact.currentUser*/
		};
	},	
	render: function () {	
		var RunopolyScore = 0;
		RunopolyScore = this.processChallenges(this.data.challenges);
		console.log(RunopolyScore);
		RunopolyScore = RunopolyScore + this.processResults(this.data.results);		
		console.log(RunopolyScore);

		return (
			<View>
				<UI.Headerbar label="Your Score" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />
				</UI.Headerbar> 
				<UI.ViewContent Scrollable>					
					<div className="panel-header text-caps">Runopoly Score</div>
					<div className="panel">
					<h1 style={this.getH1Style()}><span style={this.getScoreText()}>{RunopolyScore.toFixed(0)}</span></h1>
					</div>
					<div className="panel">						
					{!RunopolyScore ?
						<UI.Textarea value="Run or create a challenge to increase your score!" />
							:
							null
					}	
					</div>					
					<div className="panel-header text-caps">Runopoly Rank</div>
					<div className="panel">
						<UI.Textarea value="Run or create a challenge to see your rank!" />
					</div>
				</UI.ViewContent>				
			</View>
		);
	},			
	processResults: function(results) {	
		var result = 0;
		if (!results || !results.length) return result;
		_.each(results, function (resultItem) {
			if (resultItem.status) {
				result = result + Number(resultItem.challenge.stopDistance);
			}
			if (resultItem.timeLeft) {
				result = result + Math.min((60/resultItem.timeLeft).toFixed(0), 60);
			}
		});		
		return result;
	},
	processChallenges: function(challenges) {	
		var result = 0;
		if (!challenges || !challenges.length) return result;
		_.each(challenges, function (challengeItem) {
			result = result + Number(challengeItem.stopDistance);
		});		
		return result;
	},
	getH1Style: function () {
		return {
			fontSize: "4em",
			fontWeight: 100,
			color: "#42B49A",
			textAlign: "center"
		};
	},	
	getScoreText: function () {
		return {
			position: 'relative',
			width: '100%',			
			textTransform: 'uppercase',
			zIndex: 20,
			display: 'block'
		};			
	},
});
module.exports = ScoreStep1;