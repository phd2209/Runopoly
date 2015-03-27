/** @jsx React.DOM */
"use strict";
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Touchstone = require('touchstonejs');

var views = {
	//pages 
	'page-nearbyarea': React.createFactory(require('./pages/NearbyAreaPage')),
	'page-running': React.createFactory(require('./pages/RunningPage')),

	//Components
	'component-nearbyarealist': React.createFactory(require('./components/NearbyAreaList')),
	'component-nearbyareaitem': React.createFactory(require('./components/NearbyAreaItem')),
	'component-runbutton': React.createFactory(require('./components/RunButton')),
	'component-rundisplay': React.createFactory(require('./components/RunDisplay')),
	'component-runtimer': React.createFactory(require('./components/RunTimer')),
	'component-runareastatus': React.createFactory(require('./components/RunAreaStatus')),
	'component-runarearank': React.createFactory(require('./components/RunAreaRank'))
};

var App = React.createClass({
	mixins: [Touchstone.createApp(views)],

	getInitialState: function () {
		var initialState = {
			currentView: 'page-nearbyarea',
			online: true,
			isNativeApp: (typeof cordova !== 'undefined')
		};
		return initialState;
	},

	getViewProps: function () {
		return {
			online: this.state.online
		};
	},

	gotoDefaultView: function () {
		this.showView('page-nearbyarea', 'fade');
	},

	render: function () {

		return (
			<ReactCSSTransitionGroup transitionName={this.state.viewTransition.name} transitionEnter={this.state.viewTransition.in} transitionLeave={this.state.viewTransition.out} className="view-wrapper" component="div">
				{this.getCurrentView()}
			</ReactCSSTransitionGroup>
		);
	},
});

function startApp() {
	React.render(<App />, document.getElementById('main'));
}

function onDeviceReady() {
	if (typeof StatusBar !== 'undefined') {
		StatusBar.styleDefault();
		StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString('#42B49A');
	}
	startApp();
}

if (typeof cordova === 'undefined') {
	startApp();
} else {
	document.addEventListener('deviceready', onDeviceReady, false);
}
