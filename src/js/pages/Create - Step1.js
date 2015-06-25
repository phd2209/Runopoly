var React = require("react");
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var Link = require('touchstonejs').Link;
var View = require('../components/View');

var CreateStep1 = React.createClass({
	mixins: [Navigation],
	propTypes: {
		prevView: React.PropTypes.string.isRequired
	},
	getDefaultProps: function () {
        return {
			prevView: 'page-home'
		};
    },
	getInitialState: function () {
		return {
			error: '',
			name: '',
			automatic: false
		};
	},
	render: function () {
		return (
			<View>
				<UI.Headerbar label="Create Challenge" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />				
				</UI.Headerbar>
				<UI.ViewContent>
					<div className="panel-header text-caps">Required fields</div>
					<div className="panel">
						{
							this.state.error ?
								<UI.Input defaultValue={this.state.error} placeholder="Placeholder" /> 
							:
								null
						}
						<LabelInput type="text" label="Name" ref="name" defaultValue={this.state.name} onChange={this.handleNameChange}/>						
						<LabelInput label="Automatic Checkpoints" readonly>
							<UI.Switch on={this.state.automatic} onTap={this.HandleUpdateTypeChange} type="default" />
						</LabelInput>						
					</div>		
					{this.state.automatic ?
						<div className="panel-header">Checkpoint after every kilometer</div>
						:
						<div className="panel-header">Manually set Checkpoints</div>
					}
					<Link to="page-create-step2" viewTransition="fade" params={{prevView: 'page-create-step1', 
						name: this.state.name.trim(), 
						automatic: this.state.automatic}} 
						component="div"
						className="panel-button">							
						<span className='checkpoint_button' style={this.getButtonStyle()}>NEXT</span>
					</Link>
				</UI.ViewContent>
			</View>	
		);
	},
	handleNameChange: function(event) {
		this.setState({
			name: event.target.value
		});
	},
	HandleUpdateTypeChange: function() {
		this.setState({
			automatic: !this.state.automatic
		});
	},
	getButtonStyle: function () {
		return {
          color: '#42B49A',
          backgroundColor: '#fff',
          border: '1px solid transparent',
          border: 2,
		  marginTop: 10,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
		  fontWeight: 'bold',
          textDecoration: 'none',
		  textTransform: 'uppercase',
		  marginBottom: 10
		};	
	},		
});
module.exports = CreateStep1;