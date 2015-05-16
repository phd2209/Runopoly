/** @jsx React.DOM */
"use strict";
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Touchstone = require('touchstonejs');
var Parse = require('parse').Parse;

// Initialize parse
Parse.initialize('pClUhwHZ3hntw3Nyn3YAdipsFXWsgIgOM05ZJzKy', 'B3wiPTnwBfyNXPJxpm88K86Rd6qYGe8blvVXxi1i');

var views = {
	//pages 
	'page-home': require('./pages/Home'),
	'page-create-step1': require('./pages/Create - Step1'),
	'page-create-step2': require('./pages/Create - Step2'),
	'page-create-step3': require('./pages/Create - Step3'),
	/*'page-running': require('./pages/RunningPage'),
	'page-login': require('./pages/LoginWrapper'),
	'page-areaowners': require('./pages/AreaOwnersPage'),*/
	
	//Components
	'component-map': require('./components/GoogleMap'),
	'component-challenge-map': require('./components/ChallengeMap')
	/*'component-nearbyarealist': require('./components/NearbyAreaList'),
	'component-nearbyareaitem': require('./components/NearbyAreaItem'),
	'component-rundisplay': require('./components/RunDisplay'),
	'component-runtimer': require('./components/RunTimer'),
	'component-runareastatus': require('./components/RunAreaStatus'),
	'component-runarearank': require('./components/RunAreaRank'),
	'component-labelinput': require('./components/LabelInput')*/
};

var App = React.createClass({
	mixins: [Touchstone.createApp(views)],

	getInitialState: function () {
		var initialState = {
			currentView: 'page-home',
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
		this.showView('page-home', 'fade');
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
