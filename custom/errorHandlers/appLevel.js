module.exports = function(myApp) {

	/***************************************
	 * CUSTOM ERROR MESSAGES
	 ***************************************/

	function errorHandler($rootScope, $state, $translate, notification){

		/***************************
    	 * @TODO come up with a way to determine what environment the app is in
    	 * @TODO come up with pretty error messages for end users if in production
    	 * @TODO add pushes to api/log if error happens in production
    	 ***************************/

		// delete the NG-Admin default error handler
		delete $rootScope.$$listeners.$stateChangeError;

	    $rootScope.$on("$stateChangeError", function handleError(event, toState, toParams, fromState, fromParams, error) {

			console.log('ERROR HANDLER, error',error);
			// console.log('event',event);
			// console.log('toState',toState);
			// console.log('toParams',toParams);
			// console.log('fromState',fromState);
			// console.log('fromParams',fromParams);

	        if(error.status == 404) {
	            $state.go('ma-404');
	            event.preventDefault();
	        }else{
	        	var errorMessage;
	        	
	        	if(error.message){
	        		errorMessage = error.message;
	        	}else if(error.data.error.message){
	        		errorMessage = error.data.error.message;
	        	}

	            $translate('STATE_CHANGE_ERROR', { 'message': errorMessage })
	            .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
	            throw error;
	        }
	    });
	}

	myApp.run(errorHandler);

	myApp.config(['$translateProvider', function ($translateProvider) {
	    $translateProvider.translations('en', {
	      'STATE_CHANGE_ERROR': 'Error: {{ message }}'
	    });
	    $translateProvider.preferredLanguage('en');
	}]);

	return myApp;

}