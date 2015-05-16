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
						<Link to="page-create-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
							<li style={this.getListStyle()}>							
								<span style={this.getHeaderText()}>RUN</span>
								<span style={this.getSubHeaderText()}>Run to Win Challenges</span>
							</li>
						</Link>
						<Link to="page-create-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
							<li style={this.getListStyle()}>						
								<span style={this.getHeaderText()}>CREATE CHALLENGE</span>
								<span style={this.getSubHeaderText()}>Create a New Challenge</span>
							</li>
						</Link>
						<Link to="page-create-step1" viewTransition="show-from-right" params={{ prevView: 'page-home' }} component="div">
							<li style={this.getListStyle()}>						
								<span style={this.getHeaderText()}>CREATE GAME</span>
								<span style={this.getSubHeaderText()}>Create a game of Challenges</span>
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
	getListStyle: function () {
		var height = (window.innerHeight-47) / 3;
		return {
			height: height,
			width: '100%',
			background: '#ffffff',
			borderBottomWidth: 1,
			borderColor: '#dfdfdf',
			borderStyle: 'solid',
		};			
	},
	getHeaderText: function () {
		return {
			position: 'relative',
			fontSize: 'inherit',
			width: '100%',			
			margin: '0 0 70px 0',
			textTransform: 'uppercase',
			zIndex: 20,
			color: '#039E79',
			display: 'block',
			top: '30%',
			padding: 0
		};			
	},
	getSubHeaderText: function () {
		return {
			fontSize: 12,
			textTransform: 'initial',
			marginTop: -8,
			display: 'block',
			color: '#AAAAAA',
			width: '100%'			
		};
	}
});

module.exports = Home;