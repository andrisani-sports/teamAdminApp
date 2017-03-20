module.exports = function(admin) {

    // Experimental Error Handler
    function ngaErrorHandler(response,notification) {

    	/***************************
    	 * @TODO combine this function with the function in the other error handler file 
    	 * @TODO come up with a way to determine what environment the app is in
    	 * @TODO come up with pretty error messages for end users if in production
    	 * @TODO push devErrorObj below to api/log if error happens in production
    	 * @TODO add user information to devErrorObj
    	 ***************************/

    	var humane = require('humane-js');
    	var notification = humane.create({ timeout: 5000, clickToClose: true, addnCls: 'humane-flatty-error' });

    	var source = '';

        if(response.error){
        	// a generic response from a generic API
        	var errorMessage = response.error.message;
        	var errorStatus = response.error.status
        	var requestObj = {};
        	var responseObj = {};
        }else if(response.data.error){
        	// when the response comes from the Stamplay API
        	source = 'Stamplay ';
        	var errorMessage = response.data.error.message;
        	var errorStatus = response.data.error.status;
        	var requestObj = {
        		'url': response.config.url,
        		'body': response.config.data,
        		'method': response.config.method
        	};
        	var responseObj = {
        		'headers': response.headers,
        		'data': response.data
        	};
        }else{
        	var errorMessage = 'Unable to process.';
        	var errorStatus = 'Status unknown';
        	var requestObj = {};
        	var responseObj = {};
        }

        var devErrObj = {
    		'status': errorStatus,
    		'error_message': errorMessage,
    		'request': requestObj,
    		'response': responseObj,
    		'_original': response
    	};

        console.log('ERROR',devErrObj);
        notification.log('Error: ' + errorStatus + ', ' + errorMessage);

        return 'Global ADMIN error: ' + errorStatus + '(' + errorMessage + ')';
    
    }
    
    admin.errorMessage(ngaErrorHandler);

    return admin;

}