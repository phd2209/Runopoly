var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var ChallengeMap = require('../components/ChallengeMap');
var Link = require('touchstonejs').Link;
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
								<span style={this.getInfoItemStyle()}>{this.data.challenge[0].checkPoints.length}</span>
								<span style={this.getInfoItemStyle()}>{this.getDifficulty(this.data.challenge[0].checkPoints.length, this.data.challenge[0].stopDistance)}</span>								
							</div>
							: null 
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
	getDifficulty: function (checkpoints, km) {
		var x = Math.pow(checkpoints,0.5)*Math.pow(km,0.5);		
		if (x < 3) return "Easy";
		else if (3 <= x < 10) return "Moderate";
		else return "Hard";				
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