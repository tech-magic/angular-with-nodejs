var techMagicApp = angular.module('techMagicApp', [
    'ui.router',
    'ngSanitize',
    'ngStorage',
    'usersCommonCTRLs',
    'tMTranslate'
]);

techMagicApp.run(
	['$rootScope', '$http', '$state', 
	 '$timeout', '$location','$localStorage','$window', 
	function(
		$rootScope, $http, $state, 
		$timeout, $location, $localStorage, $window) {

    var currPath = $location.$$path;
    console.log(currPath);

		$rootScope.data = {};
    $rootScope.data.permissions = {};
    $rootScope.defaultTenant = 'halebop';
    $rootScope.isAuthorized = true;

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
      //event.preventDefault();
      console.log('To State : ' + JSON.stringify(toState));
      console.log('From State : ' + JSON.stringify(fromState));
      console.log('Current State : ' + JSON.stringify($state.current));
    });  

    $state.go('home', {org:$rootScope.defaultTenant});
	}]
);

