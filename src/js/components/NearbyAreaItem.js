var React = require('react'),
	SetClass = require('classnames'),
	Tappable = require('react-tappable'),
	Navigation = require('touchstonejs').Navigation,
	Link = require('touchstonejs').Link,
	UI = require('touchstonejs').UI;

var NearbyAreaItem = React.createClass({
	mixins: [Navigation],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		imageUrl: React.PropTypes.string.isRequired,
		distance: React.PropTypes.number.isRequired,
		difficulty: React.PropTypes.number.isRequired,
		type: React.PropTypes.number.isRequired,
		itemIndex: React.PropTypes.string.isRequired
	},

    render: function () {
		console.log(this.props.type);
		return (
			<Link to="page-run-step2" viewTransition="show-from-right" params={{ selectedChallengeId: this.props.itemIndex, prevView: 'page-run-step1' }} className="list-item" component="div">
				<span className="item-media">
					<span className="list-avatar">
						<img src={this.props.imageUrl} />
					</span>
				</span>
				<div className="item-inner">
					<div className="item-content">
						<div className="item-title">{this.props.name}</div>
						<div className="item-subtitle">{this.getDifficulty(this.props.difficulty)}
							{(this.props.type === 1) ? <i style={this.getIconStyle()} className='icon ion-ios-stopwatch-outline'></i> : <i style={this.getIconStyle()} className='icon ion-android-walk'></i> } 
							<i style={this.getIconStyle()} className='icon ion-location'></i>{this.props.distance} Km</div>
					</div>
					<div className="item-note default">
						<div className="item-note-icon ion-chevron-right" />
					</div>
				</div>
			</Link>
		);
	},
	getDifficulty: function (difficultyno) {
		if (difficultyno === 1) return "Easy";
		else if (difficultyno === 2) return "Moderate";
		return "Hard";				
	},	
	getIconStyle: function() {
		return {
          paddingLeft: 20,
		  paddingRight: 5
		};
	}
});
module.exports = NearbyAreaItem;