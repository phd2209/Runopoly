var React = require('react');
var UI = require('touchstonejs').UI;
var View = require('../components/View');
var Link = require('touchstonejs').Link;

var Home = React.createClass({
	displayName: 'HomePage',
	render: function () {
		return (
			<View>
				<UI.Headerbar label="Runopoly" type="runopoly">
				</UI.Headerbar> 
				<ul style={this.getHomeMenuStyle()}>
					<Link to="page-run-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
						<li style={this.getListRunStyle()}>							
							<span style={this.getHeaderRunText()}>RUN</span>
							<span style={this.getSubHeaderText()}>Run to Win Challenges</span>
						</li>
					</Link>
					<Link to="page-run-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
						<li style={this.getListScoreStyle()}>							
							<span style={this.getHeaderScoreText()}>SCORE</span>
							<span style={this.getSubHeaderText()}>Your Runopoly Score</span>
						</li>
					</Link>
					<Link to="page-create-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
						<li style={this.getListChallengeStyle()}>						
							<span style={this.getHeaderChallengeText()}>CREATE CHALLENGE</span>
							<span style={this.getSubHeaderText()}>Create a New Challenge</span>
						</li>
					</Link>
				</ul>
			</View>	
		);
	},
	getHeight: function () {
		return (window.innerHeight-44) / 3;
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
		return {
			height: this.getHeight(),
			width: '100%',
			background: '#ffffff'
		};			
	},
	getListScoreStyle: function () {		
		return {
			height: this.getHeight(),
			width: '100%',
			background: '#42B49A',
		};			
	},
	getListChallengeStyle: function () {		
		return {
			height: this.getHeight(),
			width: '100%',
			background: '#039E79',
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
	getHeaderScoreText: function () {
		return {
			position: 'relative',
			fontSize: 'inherit',
			width: '100%',			
			margin: '0 0 96px 0',
			textTransform: 'uppercase',
			zIndex: 20,
			color: '#ffffff',
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
	getSubHeaderText: function () {
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