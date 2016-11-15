angular.module('tMTranslate', ['pascalprecht.translate'])
	.config(['$translateProvider', function($translateProvider) {
		
		var fileNameConvention = {
    		prefix: '/public/i18n/locale-',
    		suffix: '.json'
  		};

		var langMap = {
      	  'en-AU': 'en',
      	  'en-CA': 'en',
      	  'en-NZ': 'en',
      	  'en-PH': 'en',
      	  'en-UK': 'en',
      	  'en-US': 'en'
        };

		$translateProvider.useStaticFilesLoader(fileNameConvention)
    		.registerAvailableLanguageKeys(['en'], langMap)
    		.determinePreferredLanguage()
    		.fallbackLanguage(['en']);
	}]);
