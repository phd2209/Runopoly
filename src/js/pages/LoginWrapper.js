var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var Tappable = require('react-tappable');

var LoginWrapper = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],

	getInitialState: function () {
		return {
			error: null,
			signup: false,
			processing: false
		}
	},
	
	observe: function () {
		return {
			user: ParseReact.currentUser
		};
	},
	
	changePage: function() {
		setTimeout(function() {
			this.showView('page-nearbyarea', 'fade', {});
		}.bind(this), 0);		
	},	
	
	render: function () {
		
		if (this.data.user) this.changePage();
		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="SIGNUP" type="runopoly">					
				</UI.Headerbar> 
				<UI.FlexBlock grow scrollable>
					<div className="panel-header text-caps">Required fields</div>
					<div className="panel">
						{
						this.state.error ?
							<UI.Input defaultValue="{this.state.error}" placeholder="Placeholder" /> 
						:
							null
						}
						<LabelInput type="email" label="Email" ref="email"/>						
						<LabelInput type="username" label="Username" ref="username"/>
						<LabelInput type="password" label="Password" ref="password"/>						
						<UI.ActionButtons>
							<UI.ActionButton className="btn-link" onTap={this.submit} label={this.state.signup ? 'Sign up' : 'Log in'} />
							<UI.ActionButton className="btn-link" onTap={this.toggleSignup}  label={this.state.signup ? 'log in' : 'sign up'} />
						</UI.ActionButtons>
					</div>
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.state.processing} className="Modal-loading" />
			</UI.FlexLayout>			
		);
	},	
	
	submit: function() {
		
		this.setState({
			processing: true
		});
		
		var self = this;
		var email = this.refs.email.getValue().trim();
		var username = this.refs.username.getValue().trim();
		var password = this.refs.password.getValue().trim();
		if (username.length && password.length && email.length) {
			if (this.state.signup) {
				console.log('signup');
				var u = new Parse.User({
					username: username,
					password: password,
					email: email
				});
				
				u.signUp().then(function() {
					self.setState({
						error: null,
						processing: false
					});
				}, function() {
					self.setState({
						error: 'Invalid account information',
						processing: false
					});
				});
			} else {
				Parse.User.logIn(username, password).then(function() {
					self.setState({
						error: null,
						processing: false
					});
				}, function() {
					self.setState({
						error: 'Incorrect username or password',
						processing: false
					});
				});
			}
		} else {
			this.setState({
				error: 'Please enter all fields',
				processing: false
			});
		}
	},
	
	logOut: function() {
		Parse.User.logOut();
	},
	
	toggleSignup: function() {
		this.setState({
			signup: !this.state.signup
		});
	}  
});

module.exports = LoginWrapper;