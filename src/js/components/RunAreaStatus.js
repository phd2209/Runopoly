var React = require("react");
var RunDisplay = require('./RunDisplay');

var RunAreaStatus = React.createClass({

	propTypes: {
		areaKm: React.PropTypes.number.isRequired
	},

	render: function () {

		return (
			<div style={this.getStyle()}>			
				<RunDisplay totalKm={this.props.areaKm} />
			</div>
		);
	},

	// Style
	// ========

	getStyle: function () {
		return {
			display: 'flex',
			height: 90,
			backgroundColor: '#42B49A',
			color: "#FFFFFF"
		};
	},
});

module.exports = RunAreaStatus;