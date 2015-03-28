var React = require("react");
var RunDisplay = require('./RunDisplay');

var RunAreaRank = React.createClass({

	propTypes: {
		currentRank: React.PropTypes.number.isRequired,
		currentRankKm: React.PropTypes.number.isRequired,
		nextRankKm: React.PropTypes.number.isRequired
	},

	render: function () {

		var text = this.props.currentRank + ' | ' + this.props.currentRankKm;

		return (
			<div style={this.getStyle()}>
				<RunDisplay totalKm={this.props.currentRank}/>
			</div>
		);
	},

	// Style
	// ========

	getStyle: function () {
		return {
			display: 'flex',
			height: 90,
			backgroundColor: '#039E79',
			color: "#FFFFFF"
		};
	},

	getDisplayStyle: function () {
		return {
			display: 'inline',
			fontSize: '35px',
			fontWeight: 200,
			color: '#FFFFFF',
			fontFamily: 'Helvetica Neue , Helvetica, Arial, sans-serif'
		};	
	},
});

module.exports = RunAreaRank;