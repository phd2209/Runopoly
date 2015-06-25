var React = require("react");
var NearbyAreaItem = require('./NearbyAreaItem');

var NearbyAreaList = React.createClass({
	propTypes: {
		challenges: React.PropTypes.array.isRequired
	},
	render: function () {
		var self = this;
		return (
			<div>
				<div className="panel panel--first avatar-list">
					{this.props.challenges.map(function(challenge) {
							return <NearbyAreaItem 
									key={challenge.objectId} 
									name={challenge.name}
									imageUrl={challenge.imageUrl}
									distance={challenge.distance}
									difficulty={self.getDifficulty(challenge.checkPoints.length, challenge.stopTime)}
									itemIndex={challenge.objectId}
									completed={challenge.completed}
								/>;
					})}
				</div>
			</div>
		);
	},
	getDifficulty: function (checkpoints, km) {
		var x = Math.pow(checkpoints,0.5)*Math.pow(km,0.5);		
		if (x < 3) return "Easy";
		else if (3 <= x < 10) return "Moderate";
		else return "Hard";				
	},
});
module.exports = NearbyAreaList;