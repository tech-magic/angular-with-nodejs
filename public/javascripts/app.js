/* This is the angular app.js */
var techMagicApp = angular.module('techMagicApp', [
    'ui.router',
    'ngSanitize',
    'ngStorage',
    'usersCommonCTRLs',
    'tMTranslate'
]);

techMagicApp.run(
	['$rootScope', '$http', '$state', 
	 '$timeout', '$location','$localStorage','$window', 'TechMagicService', 
	function(
		$rootScope, $http, $state, 
		$timeout, $location, $localStorage, $window, TechMagicService) {

    var currPath = $location.$$path;
    console.log(currPath);

		console.log(TechMagicService.myMethod());

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

techMagicApp.service('TechMagicService', ['$rootScope', '$http', function($rootScope, $http) {
    
    function privateFunc() {
    	console.log('Inside private func ...');
    	return "power of angular";
    }

    var myMethod = function() {
    	return privateFunc();
    }

    return {
    	myMethod: myMethod
    };
}]);

techMagicApp.factory('VisualizerConfigService', function() {
    return {
        configs: {
            templates: {
                historyTemplate: '/public/html/templates/history.popover.html'
            }
        }
    };
});

techMagicApp.service('FilterBindingService', ['$rootScope', function($rootScope) {
  var data = {};
  var viewData = {};
  var durationRanges = {};


  function formatDateToString(date){
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
    return (yyyy + "" + MM + "" + dd);
  }

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  //Defaults
  data.loc = '';
  data.os = '';
  data.deviceModel = '';
  data.deviceManufacturer= '';
  data.duration = 'week';
  data.state;
  data.fromdate = formatDateToString(firstDay);
  data.todate = formatDateToString(lastDay);
  data.ajax_ieCacheFix = new Date().getTime();

  durationRanges.ranges = {
    'Today': [moment(), moment()],
    'Last day': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'This week': [moment().startOf('week'), moment().endOf('week')],
    'This month': [moment().startOf('month'), moment().endOf('month')],
    'This year': [moment().startOf('year'), moment().endOf('year')]
  };

  durationRanges.rangesId = {
    'today': [moment(), moment()],
    'day': [moment().subtract('days', 1), moment().subtract('days', 1)],
    'week': [moment().startOf('week'), moment().endOf('week')],
    'month2': [moment().startOf('month'), moment().endOf('month')],
    'year': [moment().startOf('year'), moment().endOf('year')]
  };

  durationRanges.durations = [ {durationText: 'Last day', durationId: 'day'},
    {durationText: 'This week', durationId: 'week'},
    {durationText: 'This month', durationId: 'month2'},
    {durationText: 'This year', durationId: 'year'} ];

  //getters & setters for view data
  var getViewOs = function() {
    if (viewData.os) {
      return viewData.os;
    }
    else {
      return 'Operating System';
    }
  }

  var setViewOs = function(os) {
    if (os) {
      viewData.os = os;
    }
  }

  var getViewLocation = function() {
    return viewData.location || 'Location';
  }

  var setViewLocation = function(locationObj) {
    if (locationObj) {
      viewData.location = locationObj.location;
    }
  }

  var getViewDevice = function() {
    return viewData.device || 'Device';
  }

  var setViewDevice = function(deviceCode) {
    if (deviceCode) {
      viewData.device = deviceCode;
    }
  }

  var setViewDuration = function(duration, ranges) {
    if (duration) {
      viewData.duration = duration;
    }

    /*if (ranges) {
      var start = new Date(ranges[0], ranges[1], ranges[2]);
      var end   = new Date(ranges[3], ranges[4], ranges[5]);
      var when  = moment(new Date(), 'YYYY-MM-DD');
      var range = moment.range(start, end);

      viewData.durationRange = moment(start).format('YYYY-MM-DD') + '-' + moment(end).format('YYYY-MM-DD');

      if (range.diff('days') == 0 && !when.within(range)) {
        viewData.duration = 'Last day';
        data.duration = 'day';
      }
      else if (range.diff('days') == 6 && !when.within(range)) {
        viewData.duration = 'This week';
        data.duration = 'week';
      }
      else if ((range.diff('days') == 27 || range.diff('days') == 28 || range.diff('days') == 29 || range.diff('days') == 30)
        && !when.within(range)) {
        viewData.duration = 'This month';
        data.duration = 'month2';
      }
      else if ((range.diff('days') == 364 || range.diff('days') == 365) && !when.within(range)) {
        viewData.duration = 'This year';
        data.duration = 'year';
      }
      else {
        viewData.duration = 'This week';
        data.duration = 'week';
        viewData.durationRange = moment(this.durationRanges.rangesId['week'][0]).format('YYYY-MM-DD') + '-' +
          moment(this.durationRanges.rangesId['week'][1]).format('YYYY-MM-DD');
      }
    }*/
  }

  var getViewDuration = function() {
    return viewData.duration || 'This week';
  }

  var setViewDurationRange = function(durationRange) {
    if (durationRange) {
      viewData.durationRange = durationRange;
    }
  }

  var getViewDurationRange = function() {
    return viewData.durationRange || moment(this.durationRanges.rangesId['week'][0]).format('YYYY-MM-DD') + '-' +
        moment(this.durationRanges.rangesId['week'][1]).format('YYYY-MM-DD');
  }

  //end of getters and setters for view data

  var update = function(code, filter) {
    broadcast(data);
  };

  var broadcast = function(data) {
    data.ajax_ieCacheFix = new Date().getTime();
    $rootScope.$broadcast('state-update', data);
  };

  var reset = function() {
    this.setViewLocation('Location');
    this.setViewDevice('Device');
    this.setViewDuration('This week');
    this.setViewOs('Operating system');
    this.setViewDurationRange(moment(this.durationRanges.rangesId['week'][0]).format('YYYY-MM-DD') + '-' +
        moment(this.durationRanges.rangesId['week'][1]).format('YYYY-MM-DD'));
  }

  return {
    data: data,
    viewData: viewData,
    durationRanges: durationRanges,
    getViewOs: getViewOs,
    setViewOs: setViewOs,
    getViewLocation: getViewLocation,
    setViewLocation: setViewLocation,
    getViewDevice: getViewDevice,
    setViewDevice: setViewDevice,
    setViewDuration: setViewDuration,
    getViewDuration: getViewDuration,
    setViewDurationRange: setViewDurationRange,
    getViewDurationRange: getViewDurationRange,
    update: update,
    reset: reset
  };

}]);

techMagicApp.factory('DataManipulationService', function() {
    var validateNumberForSanity = function(value) {
        if (value === undefined || value === null || isNaN(value) || value === 'null' || value === 'Null') {
            return (0).toFixed(1);
        } else {
            return value;
        }
    };

    var getWrappedNumberKPIInfo = function(value, filterBindingService, title, helpText, translate, isEffortScoreKPI) {
      var currKPIInfo = {};
      currKPIInfo.kpiData = value; 
      currKPIInfo.kpiData.loaded = true;
      currKPIInfo.kpiData.error = false;
      
      currKPIInfo.kpiData.history = readHistory(currKPIInfo.kpiData);               
      
      currKPIInfo.kpiData.primary = {};
      resolveAndPopulateKPIBasedonDuration(
        currKPIInfo.kpiData.primary, 
        currKPIInfo.kpiData.history, 
        filterBindingService,
        isEffortScoreKPI);

      currKPIInfo.kpiSettings = {};
      currKPIInfo.kpiSettings.filter = 'cconumber';
      currKPIInfo.kpiSettings.title = title;

      translate(helpText).then(function(translation) {
        currKPIInfo.kpiSettings.helpText = translation;
      });

      return currKPIInfo;
    };    

  var readHistory = function(evalData) {
    
    var history = {};
    var direction = {};
    history.days = evalData.thisdaycount || 0;
    history.weeks = evalData.thisweekcount || 0;
    history.months = evalData.thismonthcount || 0;
    history.years = evalData.thisyearcount || 0;
    
    history.trendDays = evalData.day_pct || "0";
    direction = getDirection(history.trendDays);
    history.trendDays = parseFloat(history.trendDays);
    history.trendDays = Math.abs(validateNumberForSanity(history.trendDays)).toFixed(1);
    history.trendDaysDirectionCssCls = direction.cssCls;
    history.trendDaysDirectionSvg = direction.svg;
    
    history.trendWeeks = evalData.week_pct || "0";
    direction = getDirection(history.trendWeeks);
    history.trendWeeks = parseFloat(history.trendWeeks);
    history.trendWeeks = Math.abs(validateNumberForSanity(history.trendWeeks)).toFixed(1);
    history.trendWeeksDirectionCssCls = direction.cssCls;
    history.trendWeeksDirectionSvg = direction.svg;
    
    history.trendMonths = evalData.month_pct || "0";
    direction = getDirection(history.trendMonths);
    history.trendMonths = parseFloat(history.trendMonths);
    history.trendMonths = Math.abs(validateNumberForSanity(history.trendMonths)).toFixed(1);
    history.trendMonthsDirectionCssCls = direction.cssCls;
    history.trendMonthsDirectionSvg = direction.svg;
    
    history.trendYears = evalData.year_pct || "0";
    direction = getDirection(history.trendYears);
    history.trendYears = parseFloat(history.trendYears);
    history.trendYearsDirection = getDirection(parseFloat(history.trendYears));
    history.trendYears = Math.abs(validateNumberForSanity(history.trendYears)).toFixed(1);
    history.trendYearsDirectionCssCls = direction.cssCls;
    history.trendYearsDirectionSvg = direction.svg;
    
    return history;
  
  };

    var resolveAndPopulateKPIBasedonDuration = function(mainObj, history, filterBindingService) {

        var effortScore = 0;

        history.duration = filterBindingService.data.duration;
        history.underlineDay = false;
        history.underlineWeek = false;
        history.underlineMonth = false;
        history.underlineYear = false;

        switch (filterBindingService.data.duration) {
            case "day":
                {
                    mainObj.count = history.days !== 'null' ? history.days : 0;
                    effortScore = history.days;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendDays) + '%';
                    mainObj.trendDirectionCssCls = history.trendDaysDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendDaysDirectionSvg;
                    history.underlineDay = true;
                    break;
                }
            case "week":
                {
                    mainObj.count = history.weeks !== 'null' ? history.weeks : 0;
                    effortScore = history.weeks;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendWeeks) + '%';
                    mainObj.trendDirectionCssCls = history.trendWeeksDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendWeeksDirectionSvg;
                    history.underlineWeek = true;
                    break;
                }
            case "month2":
                {
                    mainObj.count = history.months !== 'null' ? history.months : 0;
                    effortScore = history.months;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendMonths) + '%';
                    mainObj.trendDirectionCssCls = history.trendMonthsDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendMonthsDirectionSvg;
                    history.underlineMonth = true;
                    break;
                }
            case "year":
                {
                    mainObj.count = history.years !== 'null' ? history.years : 0;
                    effortScore = history.years;
                    mainObj.trendAbsolute = validateNumberForSanity(history.trendYears) + '%';
                    mainObj.trendDirectionCssCls = history.trendYearsDirectionCssCls;
                    mainObj.trendDirectionSvg = history.trendYearsDirectionSvg;
                    history.underlineYear = true;
                    break;
                }
        }
    };

    return {
        validateNumberForSanity: validateNumberForSanity,
        readHistory: readHistory,
        resolveAndPopulateKPIBasedonDuration: resolveAndPopulateKPIBasedonDuration,
        getWrappedNumberKPIInfo: getWrappedNumberKPIInfo
    }
});

techMagicApp.filter('formatter', ['$filter', function($filter) {
  return function(value, filterName) {
    if(value === parseInt(value, 10)) {
      return $filter(filterName)(value);
    } else {
      if(filterName) {
        return $filter(filterName)(value, 2);
      } else {
        return "";
      }
    }
  };
}]);

techMagicApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    //$urlRouterProvider.otherwise('/login');

  	$stateProvider.state('home', {
    	url: '/home/{org}',
      templateUrl: '/public/html/dashboard/home.structure.html',
    	views: {
      		'': {
        	  templateUrl: '/public/html/dashboard/home.structure.html'
      		},
      		'filterMView@home': {
        		templateUrl: '/public/html/dashboard/filter.dashboard.html'
      		},
      		'usersMView@home': {
        		templateUrl: '/public/html/dashboard/home.section.users.html'
      		},
      		'devicesMView@home': {
        		templateUrl: '/public/html/dashboard/home.section.devices.html'
      		},
      		'viewsMView@home': {
        		templateUrl: '/public/html/dashboard/home.section.views.html'
      		},
      		'footerMView@home': {
        		templateUrl: '/public/html/common/common.section.footer.html'
      		}
    	}
  	})
  	.state('activeusers', {
    	url: '/activeusers/{org}',
    	views: {
      		'': {
        		templateUrl: '/public/html/activeusers/activeuser.structure.html'
      		},
      		'filterMView@activeusers': {
        		templateUrl: '/public/html/activeusers/filter.activeusers.html'
      		},
      		'dwActiveMView@activeusers': {
        		templateUrl: '/public/html/activeusers/activeuser.section.users.html'
      		},
      		'footerMView@activeusers': {
        		templateUrl: '/public/html/common/common.section.footer.html'
      		}
    	}
    })
  	.state('login',{
		  url: '/login',
    	cache: false,
		  views: {
        '': {
          templateUrl: '/public/html/login/signin.signin.html'
        }
		  }
    });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage','$rootScope', function($q, $location, $localStorage, $rootScope) {
		return {
			'request': function (config) {
				config.headers = config.headers || {};
				if ($localStorage.token) {
					config.headers.Authorization = 'Bearer ' + $localStorage.token;
					if($rootScope.defaultTenant){
						config.headers.defaultTenant = $rootScope.defaultTenant;
					}
				}
				return config;
			},
			'responseError': function(response) {
				if(response.status === 401 || response.status === 403) {
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	}]);
}]);

