var $ = require('jquery');
areaService = (function () {

	//Get Details for a specific area
	var findDetailsById = function (id) {
		var deferred = $.Deferred(), detailArea = null, l = areaDetails.length;

		for (var i = 0; i < l; i++) {
			if (areaDetails[i].id == id) {
				detailArea = areaDetails[i];
				break;
			}
		}
		deferred.resolve(detailArea);
		return deferred.promise();
	},
	
	//Get a specific area
	findById = function (id) {
		var deferred = $.Deferred();
		var area = null;
		var l = areas.length;
		for (var i = 0; i < l; i++) {
			if (areas[i].id == id) {
				area = areas[i];
				break;
			}
		}
		deferred.resolve(area);
		return deferred.promise();
	},
	
	//Get all areas
	getAll = function() {
		var deferred = $.Deferred();	
		deferred.resolve(areas);
		return deferred.promise();
	},


	//init: function() {

		/*return*/ areas = [{
			"id" : 1,
			"latitude" : 55.716161,
			"longitude" : 12.505524,
			"zoom" : 11,
			"name" : "Utterslevmose",
			"difficulty": 3,
			"coords" : [ {
				"latitude" : 55.715073,
				"longitude" : 12.487366
				}, {
				"latitude" : 55.716789,
				"longitude" : 12.488975
				}, {
				"latitude" : 55.716959,
				"longitude" : 12.492322
				}, {
				"latitude" : 55.71821,
				"longitude" : 12.496871
				}, {
				"latitude" : 55.720572,
				"longitude" : 12.500004
				}, {
				"latitude" : 55.720536,
				"longitude" : 12.501549
				}, {
				"latitude" : 55.719968,
				"longitude" : 12.506077
				}, {
				"latitude" : 55.720409,
				"longitude" : 12.508791
				}, {
				"latitude" : 55.719889,
				"longitude" : 12.512997
				}, {
				"latitude" : 55.722693,
				"longitude" : 12.514778
				}, {
				"latitude" : 55.72543,
				"longitude" : 12.516784
				}, {
				"latitude" : 55.727328,
				"longitude" : 12.518651
				}, {
				"latitude" : 55.727805,
				"longitude" : 12.519681
				}, {
				"latitude" : 55.728047,
				"longitude" : 12.521473
				}, {
				"latitude" : 55.727581,
				"longitude" : 12.523854
				}, {
				"latitude" : 55.726065,
				"longitude" : 12.523854
				}, {
				"latitude" : 55.725847,
				"longitude" : 12.523018
				}, {
				"latitude" : 55.72366,
				"longitude" : 12.521955
				}, {
				"latitude" : 55.722536,
				"longitude" : 12.523002
				}, {
				"latitude" : 55.721328,
				"longitude" : 12.523802
				}, {
				"latitude" : 55.720461,
				"longitude" : 12.524842
				}, {
				"latitude" : 55.72034,
				"longitude" : 12.525835
				}, {
				"latitude" : 55.720914,
				"longitude" : 12.527224
				}, {
				"latitude" : 55.720838,
				"longitude" : 12.528185
				}, {
				"latitude" : 55.720113,
				"longitude" : 12.529743
				}, {
				"latitude" : 55.719451,
				"longitude" : 12.528981
				}, {
				"latitude" : 55.719006,
				"longitude" : 12.528139
				}, {
				"latitude" : 55.718587,
				"longitude" : 12.526707
				}, {
				"latitude" : 55.718028,
				"longitude" : 12.519971
				}, {
				"latitude" : 55.71665,
				"longitude" : 12.519327
				}, {
				"latitude" : 55.717617,
				"longitude" : 12.513061
				}, {
				"latitude" : 55.717502,
				"longitude" : 12.51186
				}, {
				"latitude" : 55.716844,
				"longitude" : 12.51126
				}, {
				"latitude" : 55.715139,
				"longitude" : 12.510627
				}, {
				"latitude" : 55.714759,
				"longitude" : 12.50943
				}, {
				"latitude" : 55.714747,
				"longitude" : 12.507311
				}, {
				"latitude" : 55.714218,
				"longitude" : 12.506233
				}, {
				"latitude" : 55.712586,
				"longitude" : 12.504399
				}, {
				"latitude" : 55.711546,
				"longitude" : 12.499705
				}, {
				"latitude" : 55.712293,
				"longitude" : 12.497146
				}, {
				"latitude" : 55.712482,
				"longitude" : 12.496047
				}, {
				"latitude" : 55.712364,
				"longitude" : 12.495357
				}, {
				"latitude" : 55.712036,
				"longitude" : 12.494756
				}, {
				"latitude" : 55.711249,
				"longitude" : 12.494247
				}, {
				"latitude" : 55.710975,
				"longitude" : 12.493338
				}, {
				"latitude" : 55.711016,
				"longitude" : 12.492377
				}, {
				"latitude" : 55.711135,
				"longitude" : 12.491034
				}, {
				"latitude" : 55.711061,
				"longitude" : 12.490116
				}, {
				"latitude" : 55.710714,
				"longitude" : 12.489312
				}, {
				"latitude" : 55.709124,
				"longitude" : 12.488105
				}, {
				"latitude" : 55.708766,
				"longitude" : 12.486774
				}, {
				"latitude" : 55.708777,
				"longitude" : 12.48594
				}, {
				"latitude" : 55.709346,
				"longitude" : 12.485645
				}, {
				"latitude" : 55.711004,
				"longitude" : 12.485575
				}, {
				"latitude" : 55.712631,
				"longitude" : 12.485982
				}, {
				"latitude" : 55.714683,
				"longitude" : 12.487141
				}, {
				"latitude" : 55.715073,
				"longitude" : 12.487366
				}]
			},
			{
			"id" : 2,
			"latitude" : 55.686029,
			"longitude" : 12.565987,
			"zoom" : 11,
			"name" : "Søerne københavn",
			"difficulty": 5,
			"coords" : [ {
				"latitude" : 55.674287,
				"longitude" : 12.555065
				}, {
				"latitude" : 55.681698,
				"longitude" : 12.557167
				}, {
				"latitude" : 55.682206,
				"longitude" : 12.557217
				}, {
				"latitude" : 55.687199,
				"longitude" : 12.562104
				}, {
				"latitude" : 55.691955,
				"longitude" : 12.56897
				}, {
				"latitude" : 55.693963,
				"longitude" : 12.572119
				}, {
				"latitude" : 55.695423,
				"longitude" : 12.573422
				}, {
				"latitude" : 55.697954,
				"longitude" : 12.578593
				}, {
				"latitude" : 55.696007,
				"longitude" : 12.579891
				}, {
				"latitude" : 55.694175,
				"longitude" : 12.5762
				}, {
				"latitude" : 55.692862,
				"longitude" : 12.575042
				}, {
				"latitude" : 55.688998,
				"longitude" : 12.569098
				}, {
				"latitude" : 55.685514,
				"longitude" : 12.564592
				}, {
				"latitude" : 55.680784,
				"longitude" : 12.560493
				}, {
				"latitude" : 55.674378,
				"longitude" : 12.558712
				}, {
				"latitude" : 55.673815,
				"longitude" : 12.55542
				}, {
				"latitude" : 55.674287,
				"longitude" : 12.555065
				}]
			},
			{
			"id" : 3,
			"latitude" : 55.702658, 
			"longitude" : 12.567923,
			"zoom" : 12,
			"name" : "Fælledparken",
			"difficulty": 5,
			"coords": [{
				"latitude": 55.702743, 
				"longitude": 12.570326
				}, {
				"latitude": 55.705318, 
				"longitude": 12.574660
				}, {
				"latitude": 55.707930,
				"longitude": 12.570025
				}, {
				"latitude": 55.706479, 
				"longitude": 12.563073
				}, {
				"latitude": 55.698499, 
				"longitude": 12.561807
				}, {
				"latitude": 55.699769, 
				"longitude": 12.564597
				}, {
				"latitude": 55.696123, 
				"longitude": 12.570583
				}, {
				"latitude": 55.697193, 
				"longitude": 12.570787
				}, {
				"latitude": 55.698819, 
				"longitude": 12.574156
				}, {
				"latitude": 55.698868, 
				"longitude": 12.574928
				}, {
				"latitude": 55.699496, 
				"longitude": 12.574961
				}, {
				"latitude": 55.701945, 
				"longitude": 12.570133
				}, {
				"latitude": 55.701945, 
				"longitude": 12.570133
				}]
			},
			{        
			"id" : 4,
			"latitude" : 55.658775,
			"longitude" : 12.516459,
			"zoom" : 16,
			"name" : "Lundbeck test",
			"difficulty": 1,
			"coords": [{
				"latitude": 55.658618,
				"longitude": 12.516437
				}, {
				"latitude": 55.658572,
				"longitude": 12.517413
				}, {
				"latitude": 55.658557,
				"longitude": 12.517773
				}, {
				"latitude": 55.658724,
				"longitude": 12.517853
				}, {
				"latitude": 55.658775,
				"longitude": 12.516459
				}]
			},
			{        
			"id" : 5,
			"latitude" : 55.677069, 
			"longitude" : 12.475502,
			"zoom" : 11,
			"name" : "Damhussøen mm.",
			"difficulty": 3,
			"coords": [{
				"latitude": 55.677964, 
				"longitude": 12.485073
				}, {
				"latitude": 55.676561, 
				"longitude": 12.480609
				}, {
				"latitude": 55.678642, 
				"longitude": 12.478506
				}, {
				"latitude": 55.681449, 
				"longitude": 12.474210
				}, {
				"latitude": 55.682925, 
				"longitude": 12.473545
				}, {
				"latitude": 55.685199,  
				"longitude": 12.472472
				}, {
				"latitude": 55.687509,  
				"longitude": 12.472107
				}, {
				"latitude": 55.691210, 
				"longitude": 12.467773
				}, {
				"latitude": 55.691150,  
				"longitude": 12.466228
				}, {	
				"latitude": 55.689886, 
				"longitude": 12.466088
				}, {
				"latitude": 55.685489,  
				"longitude": 12.467204
				}, {
				"latitude": 55.682713,  
				"longitude": 12.467869
				}, {
				"latitude": 55.680826,  
				"longitude": 12.469071
				}, {
				"latitude": 55.678902,   
				"longitude": 12.470208
				}, {
				"latitude": 55.673070,   
				"longitude": 12.473577
				}, {
				"latitude": 55.672731,  
				"longitude": 12.474457
				}, {
				"latitude": 55.672719,   
				"longitude": 12.481881					
				}, {
				"latitude": 55.676954,   
				"longitude": 12.486988
				}, {
				"latitude": 55.677813, 
				"longitude": 12.485593
				}]
			},		
			{        
			"id" : 6,
			"latitude" : 55.675420, 
			"longitude" : 12.525050,
			"zoom" : 12,
			"name" : "Frederiksberg Have",
			"difficulty": 3,
			"coords": [{
				"latitude": 55.675105, 
				"longitude": 12.531444
				}, {
				"latitude": 55.677985, 
				"longitude": 12.528741
				}, {
				"latitude": 55.676654, 
				"longitude": 12.520115
				}, {
				"latitude": 55.672080, 
				"longitude": 12.518184
				}, {
				"latitude": 55.671378, 
				"longitude": 12.525350
				}, {
				"latitude": 55.674355, 
				"longitude": 12.531616
				}]
			},		
			{        
			"id" : 7,
			"latitude" : 55.747685, 
			"longitude" : 12.534844,
			"zoom" : 12,
			"name" : "Gentofte Sø",
			"difficulty": 1,
			"coords": [{
				"latitude": 55.743434, 
				"longitude": 12.537440
				}, {
				"latitude": 55.745656,  
				"longitude": 12.538556
				}, {
				"latitude": 55.752854, 
				"longitude": 12.534780
				}, {
				"latitude": 55.753820, 
				"longitude": 12.534694
				}, {
				"latitude": 55.753470, 
				"longitude": 12.533449
				}, {
				"latitude": 55.749605,  
				"longitude": 12.531518
				}, {
				"latitude": 55.746465, 
				"longitude": 12.531797
				}, {
				"latitude": 55.743168, 
				"longitude": 12.534372
				}, {
				"latitude": 55.743277, 
				"longitude": 12.537247				
				}]
			},
			{        
			"id" : 8,
			"latitude" : 55.771485,  
			"longitude" : 12.455520,
			"zoom" : 11,
			"name" : "Bagsværd Sø",
			"difficulty": 2,
			"coords": [{
				"latitude": 55.765172,  
				"longitude": 12.461684
				}, {
				"latitude": 55.766234,   
				"longitude": 12.471361
				}, {
				"latitude": 55.768865,  
				"longitude": 12.471790
				}, {
				"latitude": 55.773500,  
				"longitude": 12.472348
				}, {
				"latitude": 55.778569,  
				"longitude": 12.449045
				}, {
				"latitude": 55.778376,   
				"longitude": 12.435892
				}, {
				"latitude": 55.776783,  
				"longitude": 12.435098
				}, {
				"latitude": 55.771991,  
				"longitude": 12.442629
				}, {
				"latitude": 55.770181,  
				"longitude": 12.449453			
				}, {
				"latitude": 55.768057,    
				"longitude": 12.451663
				}, {
				"latitude": 55.769070,   
				"longitude": 12.455611
				}, {
				"latitude": 55.764930, 
				"longitude": 12.460225
				}, {
				"latitude": 55.765510, 
				"longitude": 12.464409				
				}]
			},
			{        
			"id" : 9,
			"latitude" : 55.656648, 
			"longitude" : 12.641679,
			"zoom" : 11,
			"name" : "Amager Strandpark",
			"difficulty": 2,
			"coords": [{
				"latitude": 55.665266,  
				"longitude": 12.627860
				}, {
				"latitude": 55.641732,   
				"longitude": 12.643739
				}, {
				"latitude": 55.644589, 
				"longitude": 12.652665
				}, {
				"latitude": 55.651564,  
				"longitude": 12.649146
				}, {
				"latitude": 55.655099,  
				"longitude": 12.652494
				}, {
				"latitude": 55.667106, 
				"longitude": 12.637473
				}, {
				"latitude": 55.666525, 
				"longitude": 12.628461			
				}]
			}
		];
	//},
	//details: function() {
		/*return*/ areaDetails =[{
			"id" : 1,
			"name" : "Utterslevmose",
			"Runners" : 120,
			"RunKms": 600,
			"latitude": 55.716161,
			"longitude": 12.505524,
			"difficulty": 3,
			"top5" : [{
					"id": 1,
					"name": "Mr. Magoo",
					"rank": "General",
					"picture": "john_doe.png"
				},{
					"id": 2,
					"name": "John Doe",
					"rank": "Colonel",
					"picture": "john_doe.png"
				},{
					"id": 5,
					"name": "Homer Simpson",
					"rank": "Major",
					"picture": "john_doe.png"
				},{
					"id": 8,
					"name": "John J. Rambo",
					"rank": "Captain",
					"picture": "john_doe.png"
				},{
					"id": 10,
					"name": "Van Damme",
					"rank": "Cadet",
					"picture": "john_doe.png"
			}]		
		},
		{
			"id" : 2,
			"name" : "Søerne københavn",
			"Runners": 1400,
			"RunKms": 5000,
			"latitude": 55.686029,
			"longitude": 12.565987,
			"difficulty": 5,
			"top5": [{
					"id": 1,
					"name": "Mr. Magoo",
					"rank": "General",
					"picture": "john_doe.png"
				},{
					"id": 2,
					"name": "John Doe",
					"rank": "Colonel",
					"picture": "john_doe.png"
				},{
					"id": 5,
					"name": "Homer Simpson",
					"rank": "Major",
					"picture": "john_doe.png"
				},{
					"id": 8,
					"name": "John J. Rambo",
					"rank": "Captain",
					"picture": "john_doe.png"
				},{
					"id": 10,
					"name": "Van Damme",
					"rank": "Cadet",
					"picture": "john_doe.png"
			}]
		},
		{
			"id": 3,
			"name": "Fælledparken",
			"Runners": 1200,
			"RunKms": 5000,
			"latitude": 55.701744,
			"longitude": 12.568481,
			"difficulty": 5,
			"top5": [{
					"id": 1,
					"name": "Mr. Magoo",
					"rank": "General",
					"picture": "john_doe.png"
				},{
					"id": 2,
					"name": "John Doe",
					"rank": "Colonel",
					"picture": "john_doe.png"
				},{
					"id": 5,
					"name": "Homer Simpson",
					"rank": "Major",
					"picture": "john_doe.png"
				},{
					"id": 8,
					"name": "John J. Rambo",
					"rank": "Captain",
					"picture": "john_doe.png"
				},{
					"id": 10,
					"name": "Van Damme",
					"rank": "Cadet",
					"picture": "john_doe.png"
			}]
		},
		{
			"id": 4,
			"name": "Lundbeck test",
			"Runners": 2,
			"RunKms": 25,
			"latitude": 55.658775,
			"longitude": 12.516459,
			"difficulty": 1,
			"top5": [{
					"id": 1,
					"name": "Mr. Magoo",
					"rank": "General",
					"picture": "john_doe.png"
				},{
					"id": 2,
					"name": "John Doe",
					"rank": "Colonel",
					"picture": "john_doe.png"
				},{
					"id": 5,
					"name": "Homer Simpson",
					"rank": "Major",
					"picture": "john_doe.png"
				},{
					"id": 8,
					"name": "John J. Rambo",
					"rank": "Captain",
					"picture": "john_doe.png"
				},{
					"id": 10,
					"name": "Van Damme",
					"rank": "Cadet",
					"picture": "john_doe.png"
			}]
		}
		];		
	//}
//};
 // The public API
	return {
		findDetailsById: findDetailsById,
		findById: findById,
		getAll: getAll
};
}());
module.exports = areaService;

/*

var ranking1 = {
    "id": 1,
    "rank": [{
            "name": "John Doe",
            "rank": "General",
            "picture": "john_doe.png",
            "runs": 25,
            "km": 100,
            "pct": 40,
            "isuser" : false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 12,
            "km": 52,
            "pct": 20,
            "isuser" : false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 10,
            "km": 50,
            "pct": 18,
            "isuser" : true
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 7,
            "km": 35,
            "pct": 7,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 5,
            "km": 25,
            "pct": 5,
            "isuser": false
    }]
};

var ranking2 = {
    "id": 2,
    "rank": [{
            "name": "John Doe",
            "rank": "General",
            "picture": "john_doe.png",
            "runs": 25,
            "km": 100,
            "pct": 40,
            "isuser": false
        }, {
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 12,
            "km": 52,
            "pct": 20,
            "isuser": false
        }, {
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 10,
            "km": 50,
            "pct": 18,
            "isuser": true
        }, {
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 7,
            "km": 35,
            "pct": 7,
            "isuser": false
        }, {
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 5,
            "km": 25,
            "pct": 5,
            "isuser": false
    }]
};

var ranking3 = {
    "id": 3,
    "rank": [{
            "name": "John Doe",
            "rank": "General",
            "picture": "john_doe.png",
            "runs": 25,
            "km": 100,
            "pct": 40,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 12,
            "km": 52,
            "pct": 20,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 10,
            "km": 50,
            "pct": 18,
            "isuser": true
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 7,
            "km": 35,
            "pct": 7,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 5,
            "km": 25,
            "pct": 5,
            "isuser": false
    }]
};

var ranking4 = {
    "id": 4,
    "rank": [{
            "name": "John Doe",
            "rank": "General",
            "picture": "john_doe.png",
            "runs": 25,
            "km": 100,
            "pct": 40,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 12,
            "km": 52,
            "pct": 20,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 10,
            "km": 50,
            "pct": 18,
            "isuser": true
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 7,
            "km": 35,
            "pct": 7,
            "isuser": false
        },{
            "name": "John Doe",
            "rank": "Major",
            "picture": "john_doe.png",
            "runs": 5,
            "km": 25,
            "pct": 5,
            "isuser": false
    }]
};

rankings.push(ranking1);
rankings.push(ranking2);
rankings.push(ranking3);
rankings.push(ranking4);
*/