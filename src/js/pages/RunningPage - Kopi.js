var React = require("react");
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var RunTimer = require("../components/RunTimer");
var RunDisplay = require("../components/RunDisplay");
var RunAreaStatus = require('../components/RunAreaStatus');
var RunAreaRank = require('../components/RunAreaRank');
var _ = require('underscore');
var UI = require('touchstonejs').UI;
var Navigation = require('touchstonejs').Navigation;
var geolocationMixin = require('../mixins/geoLocationMixin');

var RunningPage = React.createClass({
	mixins: [geolocationMixin, Navigation, ParseReact.Mixin],

	propTypes: {
		preview: React.PropTypes.string.isRequired,
		selectedAreaId: React.PropTypes.string.isRequired
	},

	observe: function() {
		return {
			area: (new Parse.Query('Area'))
			.equalTo("objectId", this.props.selectedAreaId),
			user: ParseReact.currentUser
		};
	},	
	
	getDefaultProps: function () {
        return {
			prevView: 'NearbyAreaPage',
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
    },

	getInitialState: function () {
		return {
			tracking: false,
			location: {latitude: 0, longitude: 0},
			duration: 0,
			processing: false
		};
	},

	componentWillMount: function () {
		this.tracking_data = [];
		this.areaKm = 0;
		this.totalKm = 0;
		this.watchPosition();
	},

	componentDidMount: function () {
		this.keepAlive();
	},

	componentWillUnmount: function () {
		this.allowSleep();
		this.unwatchPosition();
	},

	// Phonegap extension 
	// - prevent device from sleeping
	// - allow device to sleep
    keepAlive: function () {
        if (window.plugins)
            window.plugins.insomnia.keepAwake();
    },
    allowSleep: function () {
        if (window.plugins)
            window.plugins.insomnia.allowSleepAgain();
    },

	// GPS location functions	
    sign: function (x) {
		return x > 0 ? 1 : x < 0 ? -1 : 0;
    },

    PointInEllipse: function (area, point) {

        var xvec = _.pluck(area.coords, "latitude");
		var yvec = _.pluck(area.coords, "longitude");
		var pnt = [];

        pnt.push(point.latitude);
        pnt.push(point.longitude);

        var Nx = xvec.length, Ny = yvec.length;

        if (Nx != Ny) {
            var P = 999;
            return P;
        }

        xvec.push(xvec[0]); //Adding the first X-coordinate sample as the last sample 
        yvec.push(yvec[0]); //Adding the first Y-coordinate sample as the last sample
		
        /////////////////////////////////////////////////////////////////////
        //WHILE loop that loops through the complete set of polygon points,//
        //and then some ...                                                //
        /////////////////////////////////////////////////////////////////////
        var k = 0, N = 0, V = 0, S = 0, E = 0, P = 0, korig = 0;

        while (k < Nx + 1) {
            k++;
			
            ///////////////////////////////////
            // CASE: CROSSING OF EITHER AXIS //         
            ///////////////////////////////////
            if (((xvec[k] < pnt[0] && pnt[0] < xvec[k - 1]) || (xvec[k - 1] < pnt[0] && pnt[0] < xvec[k])) || ((yvec[k] < pnt[1]) && pnt[1] < yvec[k - 1]) || (yvec[k - 1] < pnt[1] && pnt[1] < yvec[k])) {

                if ((xvec[k] != xvec[k - 1]) && (yvec[k] != yvec[k - 1])) {
                    a = (yvec[k] - yvec[k - 1]) / (xvec[k] - xvec[k - 1]);
                    b = yvec[k] - a * (xvec[k] - pnt[0]);
                    x = (pnt[1] - b) / a + pnt[0];

                    //Conditions for assigning corners
                    if ((yvec[k] < b && b < yvec[k - 1]) || (yvec[k - 1] < b && b < yvec[k])) {
                        if (b > pnt[1]) {
                            N++;
                        }
						else if (b < pnt[1]) {
                            S++;
                        }
                    }
                }

                if ((xvec[k] < x && x < xvec[k - 1]) || (xvec[k - 1] < x && x < xvec[k])) {
                    if (x > pnt[0]) {
                        E++;
                    }
                    else if (x < pnt[0]) {
                        V++;
                    }
                }
                else if (xvec[k] == xvec[k - 1]) {
                    if (xvec[k] > pnt[0]) {
                        E++;
                    }
                    else if (xvec[k] < pnt[0]) {
                        V++;
                    }
                }
                else if (yvec[k] == yvec[k - 1]) {
                    if (yvec[k] > pnt[1]) {
                        N++;
                    }
                    else if (yvec[k] < pnt[1]) {
                        S++;
                    }
                }
            }
            ///////////////////////////////////////////////
            // CASE: Vertex is intersected by point axis //         
            ///////////////////////////////////////////////
            if ((xvec[k] == pnt[0]) || (yvec[k] == pnt[1]) && (!(xvec[k] == pnt[0] && yvec[k] == pnt[1]))) 
            {                
                korig = 0;
                if (k > Nx) {
                    korig = k;
                    k = k - Nx;
                }

                var m1 = 1, m2 = 1, L1 = 0, L2 = 0, L3 = 0, L4 = 0;
                                
                while ((L1 == 0 && L2 == 0) && (L3 == 0 && L4 == 0)) {                        
                    if ((k-m1) < 1) { 
                        m1 = (k-Nx);
                    }                        
                    if ((k+m2) > Nx) { 
                        m2 = (1-k);
                    }                        
                    if (xvec[k] == pnt[0]) { 
                        if ((xvec[k-m1] > pnt[0] || xvec[k-m1] < pnt[0]) && (L1 == 0)) {
                            L1 = this.sign(xvec[k-m1]-pnt[0]);
                        }
                        else {
                            m1++;
                        }
                        if ((xvec[k+m2] > pnt[0] || xvec[k+m2] < pnt[0]) && (L2 == 0)) {
                            L2 = this.sign(xvec[k+m2]-pnt[0]);
                        }
                        else {
                            m2++;
                        }
                    }
                        
                    if (yvec[k] == pnt[1]) {
                        if ((yvec[k-m1] > pnt[1] || yvec[k-m1] < pnt[1]) && (L3 == 0)) {
                            L3 = this.sign(yvec[k-m1]-pnt[1]);
                        }
                        else {
                            m1++;
                        }
                        if ((yvec[k+m2] > pnt[1] || yvec[k+m2] < pnt[1]) && (L4 == 0)) {
                            L4 = sign(yvec[k+m2]-pnt[1]);
                        }
                        else {
                            m2++;
                        }
                    }
                }
                
                if ((L1 + L2) == 0) {
                    if (yvec[k] > pnt[1]) {
                        N++;
                    }
                    else if (yvec[k] < pnt[1]) {
                        S++; 
                    }
                }
                
                if ((L3 + L4) == 0) {  
                    if (xvec[k] > pnt[0]) {
                        E++;
                    }
                    else if (xvec[k] < pnt[0]) {
                        V++; 
                    }
                }
                
                if (korig != 0) {
                    k = korig;
                }
            }
            ////////////////////////////////////////////
            // CASE: Point is a vertex in the polygon //         
            ////////////////////////////////////////////
            if (xvec[k] == pnt[0] && yvec[k] == pnt[1]) {
                P = 4;
            }
        }  

        //////////////////////////////////////////////////
        //Investigating the content of the corner vector//
        //////////////////////////////////////////////////  

        var cvs = (V % 2) + (E % 2) + (S % 2) + (N % 2);
        console.log("CVS: " + cvs);

        if ((cvs > 0) || (P == 4)) {
            P = 1;
        }
        else {
            P = 0;
        }

        console.log(P);
        return P;

        /*
        var Garea = new google.maps.Polygon(area.coords);
        var Gpoint = new google.maps.LatLng(point.coords.latitude, point.coords.longitude);
        console.log("containsLocation = " + google.maps.geometry.poly.containsLocation(Gpoint, Garea));
        console.log("isLocationOnEgde = " + google.maps.geometry.poly.isLocationOnEdge(Gpoint, Garea));
        return google.maps.geometry.poly.containsLocation(Gpoint, Garea);
        */
    },		
    gps_distance: function (lat1, lon1, lat2, lon2) {
        // http://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371; // km
        var dLat = (lat2 - lat1) * (Math.PI / 180);
        var dLon = (lon2 - lon1) * (Math.PI / 180);
        var lat1 = lat1 * (Math.PI / 180);
        var lat2 = lat2 * (Math.PI / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    },	
	tick: function() {	
		var self = this;
		this.setState({ 
			duration: this.state.duration + 1
		});
	},
	
    //Starts actual tracking of a Run    
	startTracking: function () {
		
		console.log("startTracking" +this.state.tracking);
		
		if (this.state.tracking)
		{
			this.setState({
				tracking: false
			});			
			clearInterval(this.intervalID);
			return;
		}
		
		this.setState({
				tracking: true
		});
		
        this.intervalID = setInterval(this.tick, 1000);
    },
	
	// Stops tracking of a run
    stopTracking: function () {		
	
		this.setState({
			processing: true
		});
	
		console.log("stopTracking" +this.state.tracking);
		
		clearInterval(this.intervalID);
		
		//Save run
		this.saveRun();
		
		//reset state		
		this.setState({
			tracking: false,
			duration: 0,
			location: {latitude: 0, longitude: 0},
		});
		
		this.areaKm = 0;
		this.totalKm = 0;
		
		setTimeout(function() {
			this.showView('page-areaowners', 'fade', {selectedAreaId: this.props.selectedAreaId});
		}.bind(this), 0);			
		
    },
	
	saveRun: function() {
		
		// ACL, so that only the current user can access this object
		var Area = Parse.Object.extend("Area");		
		var User = Parse.Object.extend("User"); 		
		var acl = new Parse.ACL(new User({id: this.data.user.objectId}));
		acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
		
		console.log(this.data.user);	
		ParseReact.Mutation.Create('Run', {
			areaKm: Number(this.areaKm),
			totalKm: Number(this.totalKm),
			duration: Number(this.state.duration),
			route: this.tracking_data,
			area: new Area({id: this.props.selectedAreaId}),
			user: new User({id: this.data.user.objectId}),
			ACL: acl
		}).dispatch().then(function() {
			areaKm = 0;
			totalKm = 0;
			duration = 0;
			route = [];
			area = null,
			user = null,
			ACL = null;
		});
	},		
		
	render: function () {
		
		var selectedArea = this.data.area;
		var buttonlabel  = (this.state.tracking) ? 'Pause' : 'Start';
		var totalkm = 0;
		var areakm = 0;		

		if (this.state.location) {
			this.tracking_data.push(this.state.location);			
			this.state.location.tracking = this.state.tracking;
			
			if (this.PointInEllipse(selectedArea, this.state.location)) {
				this.state.location.inarea = true;
			}
		}
		
		var total_km = 0;
		var total_km_in_area = 0;

		for (var j = 0; j < this.tracking_data.length; j++) {

			if (j == (this.tracking_data.length - 1)) {
				break;
			}

			if (this.tracking_data[j].tracking && this.tracking_data[j + 1].tracking) {
				total_km += this.gps_distance(this.tracking_data[j].latitude, this.tracking_data[j].longitude, this.tracking_data[j + 1].latitude, this.tracking_data[j + 1].longitude);
									
				if (this.tracking_data[j].inarea && this.tracking_data[j + 1].inarea) {
					total_km_in_area += this.gps_distance(this.tracking_data[j].latitude, this.tracking_data[j].longitude, this.tracking_data[j + 1].latitude, this.tracking_data[j + 1].longitude)
				}
			}
		}
	
		totalkm = total_km.toFixed(1);
		areakm = total_km_in_area.toFixed(1);
		
		//Store the values
		this.areaKm = areakm;
		this.totalKm = totalkm;
				
		return (
			<UI.FlexLayout className={this.props.viewClassName}>
				<UI.Headerbar label="EROBRE OMRÅDE" type="runopoly">
					<UI.HeaderbarButton showView={this.props.prevView} viewTransition="reveal-from-right" label="Back" icon="ion-chevron-left" className="runopoly"/>	
				</UI.Headerbar>
				<UI.FlexBlock>
					<div className="panel-header text-caps">Total</div>
					<div className="panel">
						<div className='action-buttons'>
							<div className='action-button'><RunTimer duration={this.state.duration} /></div>
							<div className='action-button'><RunDisplay totalKm={totalkm} color="#43494B"  fontsize={35}/></div>
						</div>		
					</div>
					<div className="panel-header text-caps">{selectedArea.name}</div>
					<div className="panel">
						<RunAreaStatus areaKm={areakm} />
						<RunAreaRank currentRank={this.state.location.latitude} currentRankKm={this.state.location.longitude} nextRankKm={areakm} />
					</div>
					<div className="panel-header text-caps"></div>
					<div className="panel">
						<UI.ActionButtons>
							<UI.ActionButton onTap={this.startTracking} label={buttonlabel} />
							<UI.ActionButton disabled={this.state.tracking} onTap={this.stopTracking}  label="Stop" />
						</UI.ActionButtons>
					</div>					
				</UI.FlexBlock>
				<UI.Modal header="Loading" iconKey="ion-load-c" iconType="default" visible={this.pendingQueries().length || this.state.processing} className="Modal-loading" />
			</UI.FlexLayout>
		);
	}
});

module.exports = RunningPage;