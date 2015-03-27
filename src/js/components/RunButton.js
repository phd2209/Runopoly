var React = require("react");

var RunButton = React.createClass({

	propTypes: {
		onClick: React.PropTypes.func.isRequired,
		text: React.PropTypes.string.isRequired,
		left: React.PropTypes.number.isRequired	
	},
	
	render: function () {

	return (	
		<button style={this.getStyle()} onClick={this.props.onClick}>
			<span style={this.getTextStyle()}>{this.props.text}</span>
		</button>
		);
	},

	// Style
	// ========

	getStyle: function () {
		return {
			top: window.innerHeight-50,
			left: this.props.left,
			width: '45%',
			background: 'green',			
			height: 50,
			position: 'absolute'
		};
	},
	
	getTextStyle: function () {
		return {
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: 18,
			fontSize: 18,
			margin: 0,
			color: '#fff',
			fontFamily: 'Helvetica Neue , Helvetica, Arial, sans-serif'
		};	
	},
});

module.exports = RunButton;