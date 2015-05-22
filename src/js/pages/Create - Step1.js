var React = require("react");
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var LabelInput = require('../components/LabelInput');
var LabelSelect = require('../components/LabelSelect');
var Link = require('touchstonejs').Link;

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
			processing: false,
			error: '',
			type: 1,
			difficulty: 1,
		};
	},	
	render: function () {
		
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="STEP1" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" />				
				</UI.Headerbar> 
				<div className="panel-header text-caps">Required fields</div>
				<div className="panel">
					{
						this.state.error ?
							<UI.Input defaultValue={this.state.error} placeholder="Placeholder" /> 
						:
							null
					}
					<LabelInput type="text" label="Name" ref="name"/>						
					<LabelSelect label="Type" value={this.state.type} onChange={this.handleTypeChange} options={[
						{ label: 'Time trial',     value: 1 },
						{ label: 'Timeless trial', value: 2 }
					]} />
					<LabelSelect label="Difficulty" value={this.state.difficulty} onChange={this.handleDifficultyChange} options={[
						{ label: 'Easy',       value: 1 },
						{ label: 'Moderate',   value: 2 },
						{ label: 'Hard',       value: 3 }
					]} />
				</div>
				<UI.ActionButton className="btn-runopoly" onTap={this.gotoStep2} label={'Next'} />
			</UI.FlexLayout>	
		);
	},
	gotoStep2: function() {
		this.setState({
			processing: true
		});
		
		var name = this.refs.name.getValue().trim();
        var	type = Number(this.state.type);
		var difficulty = Number(this.state.difficulty);

		if (name.length) {			
			setTimeout(function() {
				this.showView('page-create-step2', 'show-from-bottom', {prevView: 'page-create-step1', name: name, type: type, difficulty: difficulty});
			}.bind(this), 0);
		}
		else {
			this.setState({
				error: 'Please enter all fields',
				processing: false
			});			
		}
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
	}
});

module.exports = CreateStep1;