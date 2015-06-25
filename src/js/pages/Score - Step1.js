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
			prevView: 'page-home'
		};
    },
	getInitialState: function () {
		return {
			processing: true
		};
	},
	observe: function (props, state) {
		return {
			results: (new Parse.Query('Results').include('challenge'))/*,
			user: ParseReact.currentUser*/
		};
	},	
	render: function () {	
		var RunopolyScore = 0;
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
		var scoring = [];
		var seconds = 0;
		var score = 0;
		if (!results || !results.length) return score;

		_.each(results, function (result) {
			if (result.status === 1 && result.checkPoints) {
				var obj = {objectid: result.challenge.objectId, score: 0};
				_.each(result.challenge.checkPoints, function (checkpoint, i) {
					seconds = Math.abs(result.checkPoints[i].duration - checkpoint.time);
					score = 10 - Math.min((1/checkpoint.km)*(seconds/6),10);
					obj.score = obj.score + score;
					console.log(checkpoint.km);
					console.log(seconds);
				});				
				scoring.push(obj);
			}
		});		
		return score;
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