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
