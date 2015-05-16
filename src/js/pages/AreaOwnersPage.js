var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;

var AreaOwnersPage = React.createClass({
	mixins: [Navigation, ParseReact.Mixin],

	propTypes: {
		selectedAreaId: React.PropTypes.string.isRequired
	},	
	
	observe: function () {
		return {
			runs: (new Parse.Query('Run')
				.equalTo('area', Parse.Object('Area', { id: this.props.selectedAreaId })))
				.include('user')
				.include('area'),
				user: ParseReact.currentUser
		};
	},	

	render: function () {
		
		console.log(this.data.runs);
		var runs = this.SumAreaRuns(this.data.runs);
		console.log(runs);
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="OMRÅDE EJERE" type="runopoly">					
				</UI.Headerbar> 
				<UI.FlexBlock scrollable>					
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length} className="Modal-loading" />
			</UI.FlexLayout>
		);
	},

	SumAreaRuns: function(runs) {		
		var groups = _.groupBy(runs, function(run){ return run.user.username; });
		var runners = _.map(groups,(function(g, key) {
			return { user: key,
					 runs: _.size(g),
					 name: _.first(g).area.name,
					 inareakm: _(g).reduce(function(m,x) { return m + x.areaKm; }, 0),
					 totalkm: _(g).reduce(function(m,x) { return m + x.totalKm; }, 0),
					 duration: _(g).reduce(function(m,x) { return m + x.duration; }, 0)
				};
		}));		
		return _.sortBy(runners, function (num) { return num.inareakm; });
	}	
});

module.exports = AreaOwnersPage;