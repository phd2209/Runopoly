'use strict';
var React = require('react'),
	SetClass = require('classnames'),
	Tappable = require('react-tappable'),
	UI = require('touchstonejs').UI,
	LabelInput = require('../components/LabelInput');

var CheckPointItem = React.createClass({

	propTypes: {	
		order: React.PropTypes.number.isRequired,
		time: React.PropTypes.number,
		distance: React.PropTypes.number.isRequired,
		onChange: React.PropTypes.func.isRequired
	},
	
	CheckPointTimeChanged: function(event) {
		this.props.onChange(this.props.order, event.target.value);
	},
	
    render: function () {

		return (
			<div>
				<div className="panel-header text-caps">CheckPoint {this.props.order} ({this.props.distance} Km)</div>
				<div className="panel">
					<LabelInput
						type="number" 
						label="Time (min):"
						ref={this.props.order}
						defaultValue={this.roundToTwo(this.props.time / 60)}
						onChange={this.CheckPointTimeChanged}
					/>					
				</div>
			</div>
		);
	},
	roundToTwo: function (num) {    
		return +(Math.round(num + "e+2")  + "e-2");
	},	
});
module.exports = CheckPointItem;