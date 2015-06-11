var React = require("react");

var RunTimer = React.createClass({

	propTypes: {
		duration: React.PropTypes.number.isRequired
	},

	render: function () {

		return (
			<span style={this.getTextStyle()}>{this.formatDuration(this.props.duration)}</span>
		);
	},
	
	formatDuration: function(seconds) {		
		var hours = (seconds > 3600 ? Math.floor(seconds / 3600) : 0)		
		seconds = seconds - hours * 3600;
		
		var minutes = (seconds > 60 ? Math.floor(seconds / 60) : 0)
		seconds = seconds - minutes * 60;
		if (minutes < 10) {
			minutes = "0" + minutes;
		}

		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		
		return hours + ":" + minutes + ":" + seconds;
	},
		
	getTextStyle: function () {
		return {
			fontSize: '35px',
			display: 'inline',
			fontWeight: 200,
			margin: 0,
			color: '#43494B',
			fontFamily: 'Helvetica Neue , Helvetica, Arial, sans-serif'
		};	
	},
});

module.exports = RunTimer;