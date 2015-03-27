'use strict';
var React = require("react");
var NearbyAreaItem = require('./NearbyAreaItem');

var NearbyAreaList = React.createClass({

	propTypes: {
		areas: React.PropTypes.array.isRequired
	},

	render: function () {
		return (
			<div>
				<div className="panel panel--first avatar-list">
					{this.props.areas.map(function(area) {
						return <NearbyAreaItem 
									key={area.id} 
									name={area.name}
									imageUrl={area.imageUrl}
									distance={area.distance}
									difficulty={area.difficulty}
									itemIndex={area.id}
								/>;
					})}
				</div>
			</div>
		);
	},
});

module.exports = NearbyAreaList;