var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var CheckPointItem = require('../components/CheckPointItem');
var ChallengeMap = require('../components/ChallengeMap');

var CreateStep3 = React.createClass({
	mixins: [Navigation],	
	propTypes: {
		challenge: React.PropTypes.object.isRequired
	},		
	getDefaultProps: function () {
        return {
			/*prevView: 'NearbyAreaPage',*/
		};
    },	
	getInitialState: function () {
		return {
			processing: false,
			error: false,
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
				<UI.FlexBlock scrollable>
					<div className="panel-header text-caps">Route</div>
					<ChallengeMap
						challenge={this.props.challenge} 
					/>
					<div className="panel-header">Total ({this.props.challenge.stopDistance} Km)</div>
					{
						(this.props.challenge.type === 1) ?					
							<div className="panel">
								<LabelInput
									type="number" 
									ref="time"
									label="Time (min):"   
									defaultValue={this.roundToTwo(this.props.challenge.stopTime / 60)}
									onChange={this.handlestopTimeChange}
							/>						
							</div> 
						: null
					}
					{(this.props.challenge.type === 1) ?
						this.getCheckPointHtml() :
						null
					}
					<UI.ActionButton className="btn-runopoly" onTap={this.save} label={'Save'} />
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.processing} className="Modal-loading" />
			</UI.FlexLayout>	
		);
	},	
	save: function() {
		
		console.log("save clicked");
		var self =this;
		
		this.setState({
			processing: true
		});
		
		console.log(this.props.challenge.name);
		console.log(this.props.challenge.type);
		console.log(this.props.challenge.difficulty);
		console.log(this.props.challenge.startPosition);
		console.log(this.props.challenge.stopPosition);
		console.log(this.props.challenge.stopDistance);
		if (this.props.challenge.type===1)
			console.log(this.state.stopTime);
		console.log(this.props.challenge.route);
		console.log(this.props.challenge.checkPoints);
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
				setTimeout(function() {
					self.showView('page-home', 'fade', {});
				}.bind(self), 0);							
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
	getStyle: function () {
		return {
			width: '100%',
			height: '100%'
		};	
	},	
});
module.exports = CreateStep3;