var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
//var ChallengeMap = require('../components/ChallengeMap');
var ChallengeMap = require('../components/ChallengeBingMap');
var Link = require('touchstonejs').Link;
//var Tappable = require('react-tappable');
var View = require('../components/View');

var RunStep2 = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],	
	propTypes: {	
		selectedChallengeId: React.PropTypes.string.isRequired
	},	
	getDefaultProps: function () {
        return {
			prevView: 'page-run-step1',
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
			<View>
				<UI.Headerbar label="CHALLENGE" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />			
				</UI.Headerbar>
				<UI.ViewContent scrollable>
					<div className="Panel">
						{this.data.challenge[0] ?
							<div className="item-inner">							 
								<span style={this.getInfoItemStyle()}>{this.data.challenge[0].stopDistance} Km</span>
								<span style={this.getInfoItemStyle()}>{this.getType(this.data.challenge[0].type)}</span>
								<span style={this.getInfoItemStyle()}>{this.getDifficulty(this.data.challenge[0].difficulty)}</span>								
							</div>
							: null 
						}
						{this.data.challenge[0] ?
						<UI.Textarea className="challenge-info" value={this.data.challenge[0].criteria} readonly />	
						:
						null
						}
					</div>
					{this.data.challenge[0] ? 
					<ChallengeMap
						challenge={this.data.challenge[0]}
						height={350}
						radius={50}
					/>
					: null}
					<Link to="page-run-step3" viewTransition="fade" params={{prevView: 'page-run-step2', 
						challenge: this.data.challenge[0]}} 
						component="div"
						className="panel-button">						
						<span className='checkpoint_button' style={this.getButtonStyle()}>ACCEPT</span>
					</Link>					
				</UI.ViewContent>
			</View>	
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
	getButtonStyle: function () {
		
		return {
          color: '#42B49A',
          backgroundColor: '#fff',
          border: '1px solid transparent',
          border: 2,
		  marginTop: 10,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
		  fontWeight: 'bold',
          textDecoration: 'none',
		  textTransform: 'uppercase',
		  marginBottom: 10
		};	
	},	
});
module.exports = RunStep2;