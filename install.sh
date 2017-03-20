#!/bin/bash

yarn add babelify
yarn add babel-preset-es2015
echo '{ "presets": ["es2015"] }' > .babelrc
yarn add angular
yarn add bootbox
yarn add ng-admin

# BELOW WAS USED TO INITIALIZE THE REPOSITORY FOR FIRST TIME, KEPT FOR FUTURE REFERENCE
# MATT ECKMAN 3/20/2017

#mkdir models
#mkdir build
#mkdir img
#mkdir custom
#mkdir custom/interceptors
#mkdir custom/errorHandlers

#cp ../andrisaniAdminApp/index.html .
#cp ../andrisaniAdminApp/login.html .
#cp ../andrisaniAdminApp/main.css .
#cp ../andrisaniAdminApp/main.js .

#cp ../andrisaniAdminApp/custom/interceptors/stamplay.js ./custom/interceptors/
#cp ../andrisaniAdminApp/custom/errorHandlers/appLevel.js ./custom/errorHandlers/
#cp ../andrisaniAdminApp/custom/errorHandlers/admin.js ./custom/errorHandlers/

#cp ../andrisaniAdminApp/models/role.js ./models/
#cp ../andrisaniAdminApp/models/users.js ./models/
#cp ../andrisaniAdminApp/models/teams.js ./models/
#cp ../andrisaniAdminApp/models/team_members.js ./models/
#cp ../andrisaniAdminApp/models/pitchers.js ./models/
#cp ../andrisaniAdminApp/models/pitcher_workload.js ./models/

#watchify main.js -t babelify -o build/bundle.js