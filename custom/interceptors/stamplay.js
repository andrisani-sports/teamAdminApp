module.exports = function(myApp) {

	/*******************************************
	 * request RESTANGULAR INTERCEPTOR FUNCTIONS
	 *******************************************/

	myApp.config(function(RestangularProvider,$httpProvider) {
  
	    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, 
	        headers, params, httpConfig) {

	        // console.log('url',angular.copy(url));
	        // console.log('element: ',element);
	        // console.log('operation: ',operation);
	        // console.log('what: ',what);
	        // console.log('headers: ',headers);
	        // console.log('params: ',params);
	        // console.log('httpConfig',httpConfig);

	        /*
	         * FIX ISSUES FOR STAMPLAY API
	         */

	        if (operation == 'getList') {
	            // FIX PAGINATION
	            // STAMPLAY CANONICAL URL IS:
	            // https://bkschool.stamplayapp.com/api/cobject/v1/audio
	            // ? n=10 & sort=audio_url & page=1 & per_page=10

	            if(!params.page){
	                params.page = params._page;
	            }
	            if(!params.per_page){
	                params.per_page = params._perPage;
	            }
	            if(params._sortField){
	                params.sort = '';
	                if(params._sortDir == 'DESC') params.sort = '-';
	                 params.sort += params._sortField;
	            }
	            delete params._page;
	            delete params._perPage;
	            delete params._sortField;
	            delete params._sortDir;
	        }

	        //console.log('params post Stamplay processing:',params);

	        return { element: element, params: params };
	    });


	/***************************************
	 * request POST-RESTANGULAR INTERCEPTOR FUNCTIONS
	 ***************************************/
	    
	    // USING 'unshift' TO RUN THESE FUNCTIONS FIRST (after the Restangular interceptor)!!!!
	    $httpProvider.interceptors.unshift(addContentTypeToHeader);

	    // these functions run in regular order (after Restangular interceptors)
	    $httpProvider.interceptors.push(fixStamplayIssues);


	    /*
	     * FIX ISSUES FOR STAMPLAY API
	     */

	    // Angular removes the header 'Content-Type' if request is GET.
	    // This function is a hack to add the header back in, because Stamplay 
	    // requires the header.
	    function addContentTypeToHeader() {
	        return {
	            request : requestInterceptor
	        };

	        function requestInterceptor(config) {
	            if (angular.isDefined(config.headers['Content-Type']) && !angular.isDefined(config.data))
	                config.data = '';

	            return config;
	        }
	    }

	    function fixStamplayIssues($q) {
	        return {
	            request : function(config) {

	                config = angular.copy(config);

	                if(config.method == 'POST'){
	                	for(var i in config.data){
	                		if(config.data[i] === null){
	                			// config.data[i] = '';
	                			delete config.data[i];
	                		}
	                	}

	             		if(config && config.data && config.data.zones_arr){
	             			var zones = config.data.zones_arr;
	             			for(var i in zones){
	             				if(typeof zones[i] == 'object'){
	             					zones[i] = JSON.stringify(zones[i]);
	             				}
	             			}
	             		}
	             		
	                }

	                // When NG-Admin does a list GET, it receives all fields for 
	                // that data model, and those fields persist in the dataStore, 
	                // even if the editionView only defines a couple of fields. 
	                // Which means that the un-editable fields in Stamplay must be 
	                // removed before doing a PUT
	                if(config.method === 'PUT'){

	                	if(config.data){
	                		for(var i in config.data){
		                		if(config.data[i] === null){
		                			// this is a temporary fix, need to 
		                			// make it more stable
		                			if(i == 'featureVideo')
		                				config.data[i] = [];
		                			else
		                				config.data[i] = '';
		                		}
		                		if(typeof config.data[i] == 'undefined'){
		                			delete config.data[i];
		                		}
		                	}
	                	}

	                	// zones_arr is an array of strings in Stamplay, needs
	                	// processing
	                	if(config.data && config.data.zones_arr){
	             			var zones = config.data.zones_arr;
	             			for(var i in zones){
	             				if(typeof zones[i] == 'object'){
	             					zones[i] = JSON.stringify(zones[i]);
	             				}
	             			}
	             		}

	             		// if this is for a file upload
	                	if(config.file){
	                		// PLACEHOLDER FOR FUTURE CODE
	                	}else{
		                    delete config.data.__v;
		                    delete config.data._id;
		                    delete config.data.appId;
		                    delete config.data.cobjectId;
		                    delete config.data.dt_create;
		                    delete config.data.dt_update;
		                    delete config.data.id;
		                    delete config.data.actions;
	                	}
	                }

	                // translate NGAdmin filter(s) to Stamplay format
	                if(config.method == 'GET' && config.params){
	                    var where = {};

	                    // hack to fix an NGA problem: when using 'referenced_list', 
	                    // [object Object] appears in url
	                    if(config.params._filters && '[object Object]' in config.params._filters){
	                        var temp = config.params._filters['[object Object]'];
	                        delete config.params._filters['[object Object]'];
	                        where.chatRoomId = temp; // Stamplay uses a straight key:value pair in GET
	                    }

	                    if(config.params._filters){
	                        var obj = config.params._filters;
	                        for(var key in obj){
	                        	// for Stamplay, need to wrap a mongoId in 
	                        	if(obj[key]){
	                        		var value = obj[key];
	                        		var mongoId = value.search(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i) > -1 ? true : false;
	                        	
	                        		if(key == 'dt_create' || key == 'dt_modify'){
	                            
		                                where[key] = {"$gte": obj[key]}; // TODO make this work
		                                //where[key] = new Date(obj[key]); 
		                            
		                            }else if(mongoId){
		                            	// 'referenced_list' sends the foreign key in config.params._filters
		                    			// but it should be in config.params for Stamplay
		                            	// where[key] = {"$regex": "[" + obj[key] + "]", "$options": 'i'};
		                           // config.params[key] = value;
		                        		config.params['populate'] = 'true';
		                        	}else{
		                            
		                                if(obj[key] != ''){
		                                	where[key] = {"$regex": obj[key], "$options": 'i'};
		                                }
		                            
		                            }
	                        	}
	                            
	                            delete config.params._filters[key];
	                        }
	                    }

	                    // if all the previous fixes have emptied the NGA filter object, 
	                    // then delete it
	                    if(isEmpty(config.params._filters)){
	                        delete config.params._filters;
	                    }

	                    // if there are where queries, add to parameters
	                    if(!angular.equals(where,{})){
	                    	config.params.where = where;
	                    }

	                }

// // TRYING TO GET REFERENCES TO WORK IN SITUATIONS MODEL
// // the code below makes a reference field (page in situations) to have [Object object] instead of the record id
// if(config.method == 'GET' && config.params)
// 	config.params.populate = 'true';
// else if(config.method == 'GET' && !config.params){
// 	config.params = {populate: 'true'};
// }

	                return config || $q.when(config);
	            }
	        };
	    }

	    // from http://stackoverflow.com/questions/4994201/is-object-empty
	    // Speed up calls to hasOwnProperty
	    var hasOwnProperty = Object.prototype.hasOwnProperty;

	    function isEmpty(obj) {

	        // null and undefined are "empty"
	        if (obj == null) return true;

	        // Assume if it has a length property with a non-zero value
	        // that that property is correct.
	        if (obj.length > 0)    return false;
	        if (obj.length === 0)  return true;

	        // If it isn't an object at this point
	        // it is empty, but it can't be anything *but* empty
	        // Is it empty?  Depends on your application.
	        if (typeof obj !== "object") return true;

	        // Otherwise, does it have any properties of its own?
	        // Note that this doesn't handle
	        // toString and valueOf enumeration bugs in IE < 9
	        for (var key in obj) {
	            if (hasOwnProperty.call(obj, key)) return false;
	        }

	        return true;
	    }


	/********************************************
	 * response RESTANGULAR INTERCEPTOR FUNCTIONS
	 ********************************************/

	    RestangularProvider.addResponseInterceptor(function(data,operation,what,url,response,deferred){

			//console.log('in addResponseInterceptor');

	        var newResponse;
	        //console.log('Response',response);
	        //console.log(typeof response.data.data);
	        //console.log('Data',data);

	        // ADJUST STAMPLAY'S STRUCTURE TO MATCH WHAT NG-ADMIN EXPECTS
	        if('data' in response.data){
	            var newData = response.data.data;
	            if(newData.length > 0){
	                newResponse = response.data.data;
	            }else{
	                newResponse = [];
	            }
	        }else{
	            newResponse = response.data;
	        }

	        // FIX PAGINATION
	        if (operation == "getList") {
	            var contentRange = data.pagination.total_elements;
	            //console.log('num of entries retrieved by Restangular',contentRange);
	            response.totalCount = contentRange;
	        }

			//console.log('newResponse',newResponse);

	        return newResponse;

	    });

	});

}