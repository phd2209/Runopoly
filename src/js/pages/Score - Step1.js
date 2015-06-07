var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Navigation = require('touchstonejs').Navigation;

var ScoreStep1 = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],
	getDefaultProps: function () {
        return {
			prevView: 'page-home', 
		};
    },
	observe: function(props, state) {
		return {
			results: (new Parse.Query('Results')) /*,
			user: ParseReact.currentUser*/
		};
	},	
	render: function () {	
		var processResult = 0;
		processResult = this.processResults(this.data.results);		
		console.log(processResult);
		/*<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />*/
		return (
			<View>
				<UI.Headerbar label="Your Score" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />
				</UI.Headerbar> 
				<UI.ViewContent Scrollable>					
					<div className="panel-header text-caps">Runopoly Score</div>
					<h1 style={this.getH1Style()}><span style={this.getScoreText()}>{processResult}</span></h1>
					<div className="panel">
						<UI.Textarea value="Run or create a challenge to increase your score!" />
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
		console.log("processing results");
		return 0;
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