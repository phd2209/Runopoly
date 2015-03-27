'use strict';
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
		itemIndex: React.PropTypes.number.isRequired
	},

    render: function () {

		return (
			<Link to="page-running" viewTransition="show-from-right" params={{ selectedAreaId: this.props.itemIndex, prevView: 'page-nearbyarea' }} className="list-item" component="div">
				<span className="item-media">
					<span className="list-avatar">
						<img src={this.props.imageUrl} />
					</span>
				</span>
				<div className="item-inner">
					<div className="item-content">
						<div className="item-title">{this.props.name}</div>
						<div className="item-subtitle">Sværhedsgrad: {this.props.difficulty}|{this.props.distance} Km</div>
					</div>
					<div className="item-note default">
						<div className="item-note-icon ion-chevron-right" />
					</div>
				</div>
			</Link>
		);
	},
	
});
module.exports = NearbyAreaItem;