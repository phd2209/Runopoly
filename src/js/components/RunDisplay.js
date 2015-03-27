var React = require("react");

var RunDisplay = React.createClass({

	propTypes: {
		totalKm: React.PropTypes.number.isRequired,
		color: React.PropTypes.string,
		fontsize: React.PropTypes.number
	},

	render: function () {
		return (
			<span style={this.getTextStyle()}>{this.formatKm(this.props.totalKm)}<p style={this.getPStyle()}>km</p></span>
		);
	},
	
	formatKm: function(km) {
		var output = (km === 0) ? '0.0' : km;		
		return output;
	},
	
	getTextStyle: function () {
		
		var size = (this.props.fontsize) ? this.props.fontsize + 'px' : '45px';
		var color = (this.props.color) ? this.props.color : '#FFFFFF';
		
		return {
			display: 'inline',
			margin: 'auto',
			fontSize: size,
			fontWeight: 200,
			color: color,
			fontFamily: 'Helvetica Neue , Helvetica, Arial, sans-serif'
		};			
	},
	
	getPStyle: function () {	

		var color = (this.props.color) ? '#AAAAAA' : '#FFFFFF';
			
		return {
			display: 'inline',
			fontSize: '15px',
			margin: 'auto',
			fontWeight: 100,
			color: color,			
			fontFamily: 'Helvetica Neue , Helvetica, Arial, sans-serif'
		};			
	},	
});

module.exports = RunDisplay;