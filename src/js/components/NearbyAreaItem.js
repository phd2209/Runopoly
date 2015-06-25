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
		itemIndex: React.PropTypes.string.isRequired,
		completed: React.PropTypes.number.isRequired
	},
	render: function () {
		
		var className = (this.props.completed==1) ? 'list-item completed' : 'list-item';
		
		return (
			<Link to="page-run-step2" viewTransition="show-from-right" params={{ selectedChallengeId: this.props.itemIndex, prevView: 'page-run-step1' }} className={className} component="div">
				<span className="item-media">
					<span className="list-avatar">
						<img src={this.props.imageUrl} />
					</span>
				</span>
				<div className="item-inner">
					<div className="item-content">
						<div className="item-title">{this.props.name}</div>
						<div className="item-subtitle">{this.props.difficulty}
							<i style={this.getIconStyle()} className='icon ion-location'></i>{this.props.distance} Km</div>
					</div>
					<div className="item-note default">
						<div className="item-note-icon ion-chevron-right" />
					</div>
				</div>
			</Link>
		);
	},
	getIconStyle: function() {
		return {
          paddingLeft: 20,
		  paddingRight: 5
		};
	}
});
module.exports = NearbyAreaItem;