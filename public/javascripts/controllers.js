var direction = {};
direction.UP = {
    cssCls: 'nr-positive',
    svg: 'public/svg/trend-up.svg'
};
direction.DOWN = {
    cssCls: 'nr-negative',
    svg: 'public/svg/trend-down.svg'
};
direction.FLAT = {
    cssCls: 'nr-flat',
    svg: 'public/svg/trend-flat.svg'
};

var ERROR = {};
ERROR.NODATA = "No data found!";

var getDirection = function(trendValue) {
    if (trendValue < 0) {
        return direction.DOWN;
    } else if (trendValue > 0) {
        return direction.UP;
    } else if (trendValue == 0) {
        return direction.FLAT;
    } else {
        return direction.FLAT;
    }
};

var usersCommonController = angular.module('usersCommonCTRLs', ['ngAnimate']);

usersCommonController.controller('UsersCommonCTRL', ['$scope', '$http', 'FilterBindingService', '$q', '$localStorage', '$state', 'DataManipulationService', '$translate',
    function($scope, $http, FilterBindingService, $q, $localStorage, $state, DataManipulationService, $translate) {

    	$scope.data = FilterBindingService.data;
    	$scope.consolidatedusers = {};
      $scope.status = {};

    	$scope.$watch('data', function(oldValue, newValue) {
    		$scope.loadKPI();
  		});

  		$scope.$on('state-update', function(data) {
    		$scope.loadKPI();
  		});

      $scope.getKPIInfo = function(key) {
        return $scope.consolidatedusers[key];
      };

  		$scope.loadKPI = function() {

        $scope.status.isError = false;
        $scope.status.dataLoaded = false;

  			$http.get("/api/consolidated/users", {
      			params: FilterBindingService.data
    		})
    		.success(function(data){
      			var response = data["out"];
      			if (!response) { // Maybe a 404
        			$scope.status.isError = true;
        			$scope.status.errorText = data["error"];
      			} else {
        			var evalData = eval(response);

        			//console.log(JSON.stringify(evalData));

        			if(evalData['numofactiveusers']) {
        				$scope.consolidatedusers['numofactiveusers'] = 
                  DataManipulationService.getWrappedNumberKPIInfo(
                    evalData['numofactiveusers'],
                    FilterBindingService,
                    'No. of active users',
                    'helptext-numofactiveusers',
                    $translate          
                  );
        			} 
        			if(evalData['sessionperuser']) {
                $scope.consolidatedusers['sessionperuser'] = 
                  DataManipulationService.getWrappedNumberKPIInfo(
                    evalData['sessionperuser'],
                    FilterBindingService,
                    'No. of sessions',
                    'helptext-sessionperuser',
                    $translate);
        			}
        			if(evalData['sessionsPerUser']) {
                $scope.consolidatedusers['sessionsPerUser'] = 
                  DataManipulationService.getWrappedNumberKPIInfo(
                    evalData['sessionsPerUser'],
                    FilterBindingService,
                    'Sessions/Active user',
                    'helptext-sessionsPerUser',
                    $translate);
        			}
        			if(evalData['avgsessionduration']) {
                $scope.consolidatedusers['avgsessionduration'] = 
                  DataManipulationService.getWrappedNumberKPIInfo(
                    evalData['avgsessionduration'],
                    FilterBindingService,
                    'Avg. session length(s)',
                    'helptext-avgsessionduration',
                    $translate);
        			}

        			$scope.status.isError = false;
              $scope.status.dataLoaded = true;
    			
      			}
  			
  			})
  			.error(function(error){
  				$scope.status.isError = true;
          $scope.status.errorText = ERROR.NODATA;
      	});
  		};	
	}
]);
