/***************************************
 * INITIALIZE THE APPLICATION
 ***************************************/

var myApp = angular.module('myApp', 
    [
        'ng-admin'
    ]
);

/***************************************
 * API AUTHENTICATION
 ***************************************/

// require('./custom/apis/stamplay/auth')(myApp);

/***************************************
 * INTERCEPTOR FUNCTIONS
 ***************************************/

require('./custom/interceptors/stamplay')(myApp);

/***************************************
 * ERROR HANDLERS
 ***************************************/

require('./custom/errorHandlers/appLevel')(myApp);

/***************************************
 * CUSTOM CONTROLLERS
 ***************************************/

// User Name controller (used to pass user name to header)
myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
	
	$scope.username =  $window.localStorage.getItem('username');
    
}])

/***************************************
 * CUSTOM PAGES
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-pages.html
 ***************************************/



/***************************************
 * CUSTOMIZING NG-ADMIN DIRECTIVES
 * ----
 * https://github.com/marmelab/ng-admin/blob/master/doc/Theming.md#customizing-directives-templates
 * https://docs.angularjs.org/guide/decorators
 * http://stackoverflow.com/questions/32442605/angularjs-decorate-controllers
 ***************************************/

// EXAMPLE of editing text field directive without inheriting it to a custom field
// myApp.config(function(NgAdminConfigurationProvider, $provide) {
    // // Override textarea template
    // $provide.decorator('maTextFieldDirective', ['$delegate', function ($delegate) {
    //     // You can modify directly the template
    //     $delegate[0].template = angular.element($delegate[0].template).addClass('MyClass')[0].outerHTML;

    //     // or use a templateURL (loaded from a file or a <script type="text/ng-template" id="string.html"></script> tag)
    //     $delegate[0].template = '';
    //     $delegate[0].templateUrl = 'string.html';

    //     return $delegate;
    // }]);

    // // ...
// });

// The goal is to override the form submission for NGAdmin, in order to make it easier
// for custom fields to add values that can be submitted, and also to manage events
// added by custom fields. Check out these pages:
// http://stackoverflow.com/questions/32442605/angularjs-decorate-controllers
// Override:
// /node_modules/ng-admin/src/javascripts/ng-admin/Crud/form/FormController.js


/***************************************
 * DEFINE CUSTOM FIELDS & DIRECTIVES
 * ----
 * http://ng-admin-book.marmelab.com/doc/Custom-types.html
 * use of 'import': http://stackoverflow.com/questions/36451969/custom-type-the-field-class-is-injected-as-an-object-not-a-function
 ***************************************/


// REGISTER THE CUSTOM FIELDS   
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    // nga.registerFieldType('matrix_editor', MatrixEditorFieldConfig);
}]);
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    // fvp.registerFieldView('matrix_editor', MatrixEditorFieldView);
}]);

  

/***************************************
 * DEFINE DATA ENTITIES
 ***************************************/

import Field from 'admin-config/lib/Field/Field';
myApp.config(['NgAdminConfigurationProvider','RestangularProvider', 
    function(nga,Restangular) {

    // ==================================================
    // create the default admin application
    // ==================================================
    
    var admin = nga
        .application('Andrisani Sports')
        .baseApiUrl('https://pitchingdata.stamplayapp.com/api/cobject/v1/');
 
    // ==================================================
    // add entities
    // ==================================================

    // roles (https://pitchingdata.stamplayapp.com/api/user/v1/roles)
    var createRole = require('./models/role');
    var roles = nga.entity('roles').baseApiUrl('https://pitchingdata.stamplayapp.com/api/user/v1/').identifier(nga.field('_id'));
    
    // users (https://online-school-for-the-work.stamplayapp.com/api/user/v1/)
    var createUser = require('./models/users');
    var userEntity = nga.entity('users').baseApiUrl('https://pitchingdata.stamplayapp.com/api/user/v1/');

    // teams
    var createTeams = require('./models/teams');
    var teams = nga.entity('teams');

    // team members
    var createTeamMembers = require('./models/team_members');
    var team_members = nga.entity('team_members');

    // pitchers
    var createPitchers = require('./models/pitchers');
    var pitchers = nga.entity('pitchers');

    // pitcher workload
    var createPitcherWorkload = require('./models/pitcher_workload');
    var pitcher_workload = nga.entity('pitcher_workload');
    
    

    // ADD TO ADMIN OBJECT
    admin.addEntity(createRole(nga,roles));
    admin.addEntity(createUser(nga,userEntity,roles));
    admin.addEntity(createTeams(nga,teams,userEntity));
    admin.addEntity(createTeamMembers(nga,team_members,teams,userEntity));
    admin.addEntity(createPitchers(nga,pitchers,teams,userEntity));
    admin.addEntity(createPitcherWorkload(nga,pitcher_workload,pitchers,userEntity));
    
/***************************************
 * CUSTOM MENU
 ***************************************/

    admin.menu(nga.menu()
        .addChild(nga.menu().title('Dashboard').icon('<span class="glyphicon glyphicon-calendar"></span>&nbsp;').link('/dashboard'))
        .addChild(nga.menu(nga.entity('users')).title('Users').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        .addChild(nga.menu().title('Team Info').icon('<span class="glyphicon glyphicon-folder-open"></span>&nbsp;')
            .addChild(nga.menu(nga.entity('teams')).title('Teams').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('team_members')).title('Team Members').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
        )
        .addChild(nga.menu().title('Pitcher Info').icon('<span class="glyphicon glyphicon-folder-open"></span>&nbsp;')
            .addChild(nga.menu(nga.entity('pitchers')).title('Pitchers').icon('<span class="glyphicon glyphicon-user"></span>&nbsp;'))
            .addChild(nga.menu(nga.entity('pitcher_workload')).title('Pitcher Workload').icon('<span class="glyphicon glyphicon-list-alt"></span>&nbsp;'))
        )
    );

/***************************************
 * CUSTOM HEADER
 ***************************************/
    var customHeaderTemplate =
    '<div class="navbar-header">' +
        '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' +
          '<span class="icon-bar"></span>' +
          '<span class="icon-bar"></span>' +
          '<span class="icon-bar"></span>' +
        '</button>' +
        '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">Shoulder Saver</a>' +
    '</div>' +

    '<ul class="nav navbar-top-links navbar-right hidden-xs">' +
        '<li class="dropdown">' +
            '<a class="dropdown-toggle username" data-toggle="dropdown" ng-controller="username">' +
                '<i class="glyphicon glyphicon-user"></i>&nbsp;{{username}}&nbsp;<i class="fa fa-caret-down"></i>' +
            '</a>' +
            '<ul class="dropdown-menu dropdown-user" role="menu">' +
                '<li><a href="#" onclick="logout()"><i class="glyphicon glyphicon-log-out"></i> Logout</a></li>' +
            '</ul>' +
        '</li>' +
    '</ul>';

    admin.header(customHeaderTemplate);

/***************************************
 * CUSTOM DASHBOARD
 * http://ng-admin-book.marmelab.com/doc/Dashboard.html
 ***************************************/


/***************************************
 * CUSTOM ERROR MESSAGES
 ***************************************/

    var adminErrorHandlers = require('./custom/errorHandlers/admin');
    adminErrorHandlers(admin);


/***************************************
 * ATTACH ADMIN APP TO DOM & RUN
 ***************************************/

    nga.configure(admin);

}]);