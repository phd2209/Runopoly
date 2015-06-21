var React = require("react");
var NearbyAreaItem = require('./NearbyAreaItem');

var NearbyAreaList = React.createClass({

	propTypes: {
		challenges: React.PropTypes.array.isRequired,
		filterState: React.PropTypes.number.isRequired
	},

	render: function () {
		var filter = this.props.filterState;		
		return (
			<div>
				<div className="panel panel--first avatar-list">
					{this.props.challenges.map(function(challenge) {
						
						if (filter == challenge.completed) { 												
							return <NearbyAreaItem 
									key={challenge.objectId} 
									name={challenge.name}
									imageUrl={challenge.imageUrl}
									distance={challenge.distance}
									difficulty={challenge.difficulty}
									type={challenge.type}
									itemIndex={challenge.objectId}
								/>;
						}
					})}
				</div>
			</div>
		);
	},
});

module.exports = NearbyAreaList;