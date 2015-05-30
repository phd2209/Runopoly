var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var ChallengeMap = require('../components/ChallengeBingMap');

var RunStep2 = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],	
	propTypes: {	
		selectedChallengeId: React.PropTypes.string.isRequired
	},	
	getDefaultProps: function () {
        return {
			prevView: 'page-run-step1'
		};
    },
	observe: function() {
		return {
			challenge: (new Parse.Query('Challenge'))
			.equalTo("objectId", this.props.selectedChallengeId) /*,
			user: ParseReact.currentUser*/
		};
	},		
	render: function () {		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="CHALLENGE" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />			
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
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
					/>
					: null}
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />
			</UI.FlexLayout>	
		);
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
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	}	
});
module.exports = RunStep2;