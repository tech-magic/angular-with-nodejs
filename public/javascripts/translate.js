angular.module('tMTranslate', ['pascalprecht.translate'])
	.config(['$translateProvider', function($translateProvider) {
		
		/*$translateProvider.translations('en', {
			HELP_TEXT_NO_OF_ACTIVE_USERS: 'Welcome to the angular-translate API reference. If you want to know how angular-translate works, checkout the developer guide!',
			TITLE_NO_OF_ACTIVE_USERS: 'No of active users'
		});

		$translateProvider.translations('de', {
			HELP_TEXT_NO_OF_ACTIVE_USERS: 'Willkommen in der Winkel übersetzen API-Referenz . Wenn Sie wissen wollen, wie Werke Winkel übersetzen , Check-out die Entwicklerhandbuch  !',
			TITLE_NO_OF_ACTIVE_USERS: 'Anzahl der aktiven Benutzer'
		});*/

		$translateProvider.useStaticFilesLoader({
			files: [{
				prefix: '/public/i18n/locale-',
				suffix: '.json'
			}]
		});

		$translateProvider.preferredLanguage('en');
	}]);