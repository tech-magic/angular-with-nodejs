var techMagicControllers = angular.module('techMagicCTRLs', []);

techMagicControllers.controller('UsersCommonCTRL', ['$scope', '$http', 'FilterBindingService', '$q', '$localStorage', '$state', 'DataManipulationService', '$translate',
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

techMagicControllers.controller('NavigationCTRL', ['$scope', '$rootScope', 'FilterBindingService', 'CommonAttributeSharingService',
    function($scope, $rootScope, filterBindingService, commonAttributeSharingService) {

        $scope.data = {};
        $scope.data.appName = "Tech Magic Apps";
        $scope.data.locations = commonAttributeSharingService.getCitiesForFiltering();
        $scope.data.oss = ['Any', 'iOS', 'Android'];
        $scope.data.devices = commonAttributeSharingService.getDevicesForFiltering();
        $scope.data.selectedDevice = null;
        $scope.data.selectedLocation = null;
        $scope.data.durations = filterBindingService.durationRanges.durations;

        $scope.data.location = filterBindingService.getViewLocation() || 'Location';
        $scope.data.os = filterBindingService.getViewOs() || 'Operating system';
        $scope.data.device = filterBindingService.getViewDevice() || 'Device';
        $scope.data.duration = filterBindingService.getViewDuration() || 'This week';
        $scope.data.durationRange = filterBindingService.getViewDurationRange();

        $scope.data.testDateRange = null;
        $scope.ranges = filterBindingService.durationRanges.ranges;
        $scope.viewData = filterBindingService.viewData;

        $scope.recordFilter = function($item, $model, $label, $event, code) {
            var filterSelection = 'Any';

            if (code === 'LC') {
                filterSelection = $item.locationId;
                filterBindingService.data.loc = $item.locationId;
                filterBindingService.setViewLocation($item);
                $scope.data.location = $item;
                $scope.data.selectedLocation = filterBindingService.getViewLocation();
            } else if (code === 'OS') {
                filterSelection = $event.target.name;
                filterBindingService.data.os = $event.target.name;
                filterBindingService.setViewOs($event.target.innerHTML);
                $scope.data.os = filterBindingService.getViewOs();
            } else if (code === 'DV') {
                filterSelection = $item.deviceId;
                filterBindingService.data.deviceModel = $item.deviceCode;
                filterBindingService.data.deviceManufacturer = $item.manufacturer;
                filterBindingService.setViewDevice($item.deviceCode);
                $scope.data.device = $item.deviceCode;
                $scope.data.selectedDevice = $item;
            } else if (code === 'DU') {
                filterSelection = $event.target.name;
                filterBindingService.data.duration = $event.target.name;
                $scope.data.duration = $event.target.innerHTML;
                var durationText = $event.target.name;

                filterBindingService.setViewDuration($event.target.innerHTML);
                var fromDate = moment(filterBindingService.durationRanges.rangesId[durationText][0]);
                var toDate = moment(filterBindingService.durationRanges.rangesId[durationText][1]);
                filterBindingService.setViewDurationRange(fromDate.format('YYYY-MM-DD') + '-' + toDate.format('YYYY-MM-DD'));
                filterBindingService.data.fromdate = fromDate.format('YYYYMMDD');
                filterBindingService.data.todate = toDate.format('YYYYMMDD');
            } else if (code === 'LOO') {
                /*console.log($event);*/
                var range = $event.target.value.split('-');
                filterBindingService.setViewDuration('', range);

                var frmdate = range[0] + '' + range[1] + '' + range[2];
                var tdate = range[3] + '' + range[4] + '' + range[5];
                /*console.log(frmdate + '|' + tdate);*/
                filterBindingService.data.fromdate = frmdate.trim();
                filterBindingService.data.todate = tdate.trim();
            } else if (code === 'RESET') {
                $scope.data.selectedDevice = null;
                $scope.data.selectedLocation = null;

                filterBindingService.reset();

                $scope.data.location = 'Location';
                $scope.data.os = 'Operating system';
                $scope.data.device = 'Device';
                $scope.data.duration = 'This week';
                $scope.data.durationRange = filterBindingService.getViewDurationRange();

                filterBindingService.data.loc = '';
                filterBindingService.data.os = '';
                filterBindingService.data.deviceModel = '';
                filterBindingService.data.deviceManufacturer = '';
                filterBindingService.data.duration = 'week';
                var defaultFromDate = moment(filterBindingService.durationRanges.rangesId['week'][0]);
                var defaultToDate = moment(filterBindingService.durationRanges.rangesId['week'][1]);
                filterBindingService.data.fromdate = defaultFromDate.format('YYYYMMDD');
                filterBindingService.data.todate = defaultToDate.format('YYYYMMDD');
                $scope.data.testDateRange = null;
            }

            filterBindingService.update(code, filterSelection);

        }

        // Event listner for resetting the filters when navigating back to home page from analytics view
        $rootScope.$on('invokeResetFilters', function() {
            /*console.log('invokeResetFilters on NavigationCTRL.....');*/
            filterBindingService.reset();
            filterBindingService.data.loc = '';
            filterBindingService.data.os = '';
            filterBindingService.data.deviceModel = '';
            filterBindingService.data.deviceManufacturer = '';
            filterBindingService.data.duration = 'week';
            var defaultFromDate = moment(filterBindingService.durationRanges.rangesId['week'][0]);
            var defaultToDate = moment(filterBindingService.durationRanges.rangesId['week'][1]);
            filterBindingService.data.fromdate = defaultFromDate.format('YYYYMMDD');
            filterBindingService.data.todate = defaultToDate.format('YYYYMMDD');
            $scope.data.testDateRange = null;
        });

    }
]);
