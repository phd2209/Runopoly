var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var CheckPointItem = require('../components/CheckPointItem');
var ChallengeMap = require('../components/ChallengeMap');
var Tappable = require('react-tappable');

var CreateStep3 = React.createClass({
	mixins: [Navigation],	
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},			
	getInitialState: function () {
		return {
			processing: false,
			stopTime: 0
		};
	},	
	componentWillMount: function () {
		this.setState({			
			stopTime: this.roundToTwo(this.props.challenge.stopTime)
		});	
	},	
	getCheckPointHtml: function() {
		var self = this;
		return this.props.challenge.checkPoints.map(function(checkPoint) {
			return <CheckPointItem 
				key={checkPoint.order} 
				order={checkPoint.order}
				time={checkPoint.time}
				distance={checkPoint.km}
				onChange={self.checkPointTimeChange}
				/>;
		})	
	},
	render: function () {
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="Save Challenge" type="runopoly">					
				</UI.Headerbar>
				<UI.FlexBlock grow scrollable>
					<div className="Panel">
						<div className="item-inner">
							<span style={this.getInfoItemStyle()}>{this.props.challenge.stopDistance} Km</span>
							<span style={this.getInfoItemStyle()}>{this.getType(this.props.challenge.type)}</span>
							<span style={this.getInfoItemStyle()}>{this.getDifficulty(this.props.challenge.difficulty)}</span>
						</div>
					</div>
					<ChallengeMap
						challenge={this.props.challenge} 
					/>
					{						
						(this.props.challenge.type === 1) ?
							<div>
							<div className="panel-header">Challenge time</div>
							<div className="panel">
								<LabelInput
									type="number" 
									ref="time"
									label="Time (min):"   
									defaultValue={this.roundToTwo(this.props.challenge.stopTime / 60)}
									onChange={this.handlestopTimeChange}
							/>						
							</div> 
							</div>
						: null
					}
					{(this.props.challenge.type === 1) ?
						this.getCheckPointHtml() :
						null
					}
					<Tappable className="panel-button" style={this.getButtonStyle()} onTap={this.save}>save</Tappable>
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.processing} className="Modal-loading" />
			</UI.FlexLayout>	
		);
	},	
	save: function() {

		var self =this;		
		this.setState({
			processing: true
		});
		// ACL, so that only the current user can access this object			
		//var User = Parse.Object.extend("User"); 
		//var acl = new Parse.ACL(new User({id: this.data.user.objectId}));
		//acl.setPublicReadAccess(true);
		//acl.setPublicWriteAccess(true);
			
		ParseReact.Mutation.Create('Challenge', {
			name: this.props.challenge.name,
			type: this.props.challenge.type,
			difficulty: this.props.challenge.difficulty,
			startPosition: this.props.challenge.startPosition,
			stopPosition: this.props.challenge.stopPosition,
			stopTime: (this.props.challenge.type===1) ? this.state.stopTime : 0,
			stopDistance: this.props.challenge.stopDistance,
			route: this.props.challenge.route,
			criteria: "",
			checkPoints: this.props.challenge.checkPoints
			}).dispatch().then(function() {			
				self.setState({
					processing: false
				});				
				self.showView('page-home', 'fade', {});
		});			
	},
	roundToTwo: function (num) {    
		return +(Math.round(num + "e+2")  + "e-2");
	},	
	handlestopTimeChange: function(event) {	
		this.setState({			
			stopTime: Number(event.target.value) * 60
		});
	},
	checkPointTimeChange: function(item, time) {
		var index = item - 1;
		this.props.challenge.checkPoints[index].time = Number(time) * 60;
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
	},	
	getButtonStyle: function () {
		return {
          color: '#fff',
          backgroundColor: '#42B49A',
          border: '1px solid transparent',
          border: 2,
		  marginTop: 10,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
          textDecoration: 'none',
		  textTransform: 'uppercase',
		  marginBottom: 10
		};	
	},	
});
module.exports = CreateStep3;