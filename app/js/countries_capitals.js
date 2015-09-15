angular.module('countriesAndCapitals', ['ngRoute', 'ngAnimate'])
	.constant('countriesInfoUrl', 'http://api.geonames.org/countryInfo?username=manjarb')
	.constant('countriesDetailsUrl', 'http://api.geonames.org/countryInfo?username=manjarb&country={{ countryCode }}&maxRows=1')
	.constant('capitalDetailsUrl', 'http://api.geonames.org/search?username=manjarb&name_equals={{ capitalName }}&maxRows=1&style=LONG')
	.factory('countriesInfoRequest', function($http, $q, countriesInfoUrl) {
		return function() {
		  return $http({
		    cache : true,
		    method: 'GET',
		    url: countriesInfoUrl
		  })
		}
	})
	.factory('countriesDetailsRequest', function($http, $q, $interpolate, countriesDetailsUrl) {
		return function(countryCode) {

            var defer = $q.defer();
            var path = $interpolate(countriesDetailsUrl)({
						    countryCode : countryCode
						  });

            $http({
				    cache : true,
				    method: 'GET',
				    url: path
				  })
			        .then(function(response) {
			            defer.resolve(response.data);
			        });
            return defer.promise;
        }
	})
	.factory('capitalDetailsRequest', function($http, $q, $interpolate, capitalDetailsUrl) {
		return function(capitalName) {

            var defer = $q.defer();
            var path = $interpolate(capitalDetailsUrl)({
						    capitalName : capitalName
						  });

            alert(path);

            $http({
				    cache : true,
				    method: 'GET',
				    url: path
				  })
			        .then(function(response) {
			            defer.resolve(response.data);
			        });
            return defer.promise;
        }
	})
	.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl : 'home.html',
            controller : 'HomeCtrl'
        }).when('/countries', {
            templateUrl : 'countries/countries_table.html',
            controller : 'CountriesListCtrl'
        }).when('/countries/:country/:code/capital', {
            templateUrl : 'countries/countries_details.html',
            controller : 'CountriesDetailsCtrl',
            resolve : {
            	country: function($route, $location) {
				            var country = $route.current.params.code;
				            
				            return country;
				        }
            }
        }).when('/error', {
            template : '<p>Error - Page Not Found</p>'
        }).otherwise('/');
    }])
    .controller('HomeCtrl', function($scope) {
        //empty for now
        
    })
    .controller('CountriesListCtrl', function($scope,$http,$q,countriesInfoRequest) {
        //empty for now

        countriesInfoRequest()
	        .then(function(response) {
		      

		      $scope.aa = "ueoeouoe";
		      //alert(response.data);
		      var x2js = new X2JS();
		      var json = x2js.xml_str2json(response.data);
		      //alert(json.geonames.country)
		      $scope.countries = json.geonames.country;
		    });

    })
    .controller('CountriesDetailsCtrl', function($scope,$http,$q,countriesDetailsRequest,country,capitalDetailsRequest) {
        //empty for now

        //countriesDetailsRequest(country,code);
        countriesDetailsRequest(country)
			.then(function(result) {
	            var test = result;

	            var x2js = new X2JS();
	            var json = x2js.xml_str2json(test);

	            var geonameResult = json.geonames.country;

	            var capitalNameResult = geonameResult.capital;

	            capitalDetailsRequest(capitalNameResult).then(function(resultCapital) {

	            	var x2js = new X2JS();
	            	var json = x2js.xml_str2json(resultCapital);
	            	var capitalResult = json.geonames.geoname;

	            	$scope.population = geonameResult.population;
		            $scope.area = geonameResult.areaInSqKm;
		            $scope.capital = geonameResult.capital;
		            $scope.populationCapital = capitalResult.population;
	            });

	        });

    });