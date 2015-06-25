var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var CheckPointItem = require('../components/CheckPointItem');
var ChallengeMap = require('../components/ChallengeMap');
var Tappable = require('react-tappable');
var View = require('../components/View');

var CreateStep3 = React.createClass({
	mixins: [Navigation],	
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
		return {
			stopTime: 0
		};
	},
	componentDidMount: function () {
		this.setState({			
			stopTime: this.roundToTwo(this.props.challenge.stopTime)
		});	
	},	
	render: function () {
		return (
			<View className={this.props.viewClassName}>
				<UI.Headerbar label="Save Challenge" type="runopoly">					
				</UI.Headerbar>
				<UI.ViewContent grow scrollable>
					<div className="Panel">
						<div className="item-inner">
							<span style={this.getInfoItemStyle()}>{this.props.challenge.stopDistance} Km</span>
							<span style={this.getInfoItemStyle()}>{this.props.challenge.checkPoints.length} CPs</span>
							<span style={this.getInfoItemStyle()}>{this.getDifficulty(this.props.challenge.checkPoints.length, this.props.challenge.stopDistance)}</span>
						</div>
					</div>
					<ChallengeMap
						challenge={this.props.challenge}
						radius={50}
					/>

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
					{this.getCheckPointHtml()}
					<Tappable className="panel-button" 
						component="div"
						onTap={this.save}>
							<span className='checkpoint_button' style={this.getButtonStyle()}>SAVE</span>
					</Tappable>
				</UI.ViewContent>
			</View>	
		);
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
			startPosition: this.props.challenge.startPosition,
			stopPosition: this.props.challenge.stopPosition,
			stopTime: this.state.stopTime,
			stopDistance: Number(this.props.challenge.stopDistance),
			route: this.props.challenge.route,
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
		console.log("handlestopTimeChange");
		this.setState({			
			stopTime: Number(event.target.value) * 60
		});
	},
	checkPointTimeChange: function(item, time) {
		var index = item - 1;
		this.props.challenge.checkPoints[index].time = Number(time) * 60;
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
	}
});
module.exports = CreateStep3;