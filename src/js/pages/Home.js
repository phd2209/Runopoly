var React = require("react");
var UI = require('touchstonejs').UI;
var Link = require('touchstonejs').Link;

var Home = React.createClass({
	render: function () {
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="Runopoly" type="runopoly">
				</UI.Headerbar> 
					<ul style={this.getHomeMenuStyle()}>
						<Link to="page-run-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
							<li style={this.getListRunStyle()}>							
								<span style={this.getHeaderRunText()}>RUN</span>
								<span style={this.getSubHeaderRunText()}>Run to Win Challenges</span>
							</li>
						</Link>
						<Link to="page-create-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
							<li style={this.getListChallengeStyle()}>						
								<span style={this.getHeaderChallengeText()}>CREATE CHALLENGE</span>
								<span style={this.getSubHeaderChallengeText()}>Create a New Challenge</span>
							</li>
						</Link>
					</ul>				
			</UI.FlexLayout>	
		);
	},
	getHomeMenuStyle: function () {
		return {
			margin: 0,
			padding: 0,
			listStyleType: 'none',
			display: 'inline',
			fontFamily: 'Merriweather Sans',
			fontWeight: 800,
			fontSize: 26,
			width: '100%',
			textAlign: 'center'
		};			
	},
	getListRunStyle: function () {
		var height = (window.innerHeight-67) / 2;
		return {
			height: height,
			width: '100%',
			background: '#ffffff',
			borderBottomWidth: 1,
			borderColor: '#dfdfdf',
			borderStyle: 'solid'
		};			
	},
	getListChallengeStyle: function () {
		var height = (window.innerHeight-67) / 2;
		return {
			height: height,
			width: '100%',
			background: '#039E79',
			borderBottomWidth: 1,
			borderColor: '#dfdfdf',
			borderStyle: 'solid'
		};			
	},
	getHeaderRunText: function () {
		return {
			position: 'relative',
			fontSize: 'inherit',
			width: '100%',			
			margin: '0 0 96px 0',
			textTransform: 'uppercase',
			zIndex: 20,
			color: '#039E79',
			display: 'block',
			top: '30%',
			padding: 0
		};			
	},
	getHeaderChallengeText: function () {
		return {
			position: 'relative',
			fontSize: 'inherit',
			width: '100%',			
			margin: '0 0 96px 0',
			textTransform: 'uppercase',
			zIndex: 20,
			color: '#FFFFFF',
			display: 'block',
			top: '30%',
			padding: 0
		};			
	},
	getSubHeaderRunText: function () {
		return {
			fontSize: 12,
			textTransform: 'initial',
			display: 'block',
			color: '#43494B',
			width: '100%'			
		};
	},
	getSubHeaderChallengeText: function () {
		return {
			fontSize: 12,
			textTransform: 'initial',
			display: 'block',
			color: '#43494B',
			width: '100%'			
		};
	}
});
module.exports = Home;