var React = require("react");
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var LabelSelect = require('../components/LabelSelect');
var Link = require('touchstonejs').Link;
var View = require('../components/View');

var CreateStep1 = React.createClass({
	mixins: [Navigation],	
	propTypes: {
		prevView: React.PropTypes.string.isRequired
	},		
	getDefaultProps: function () {
        return {
			prevView: 'page-home',
		};
    },	
	getInitialState: function () {
		return {
			error: '',
			name: '',
			type: 1,
			difficulty: 1,
			automatic: false
		};
	},	
	render: function () {
		
		return (
			<View>
				<UI.Headerbar label="Challenge type" type="runopoly">
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
						<LabelSelect label="Type" value={this.state.type} onChange={this.handleTypeChange} options={[
							{ label: 'Time trial',     value: 1 },
							{ label: 'Timeless trial', value: 2 }
						]} />
						<LabelSelect label="Difficulty" value={this.state.difficulty} onChange={this.handleDifficultyChange} options={[
							{ label: 'Easy',       value: 1 },
							{ label: 'Moderate',   value: 2 },
							{ label: 'Hard',       value: 3 }
						]} />
						<UI.LabelInput label="Automatic Checkpoints">
							<UI.Switch on={this.state.automatic} onTap={this.HandleUpdateTypeChange} type="default" />
						</UI.LabelInput>
					</div>		
					
					<Link to="page-create-step2" viewTransition="fade" params={{prevView: 'page-create-step1', 
						name: this.state.name.trim(), 
						type: Number(this.state.type), 
						difficulty: Number(this.state.difficulty)}} 
						component="div">						
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
	handleTypeChange: function(newType) {
		this.setState({
			type: newType
		});
	},
	handleDifficultyChange: function(newDifficulty) {
		this.setState({
			difficulty: newDifficulty
		});
	},
	HandleUpdateTypeChange: function() {
		this.setState({
			automatic: !this.state.automatic
		});
	},
	getButtonStyle: function () {
		return {
		  position:'absolute',
          bottom:'2%',
          color: '#fff',
          backgroundColor: '#42B49A',
          padding: 11,
          border: '1px solid transparent',
          border: 2,
          outline: 'none',
          width: '96%',
          left: 5,
          textAlign: 'center',
          textDecoration: 'none',
          margin: '0px auto'
		};	
	},	
});
module.exports = CreateStep1;