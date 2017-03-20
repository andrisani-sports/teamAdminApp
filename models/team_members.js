module.exports = function(nga,team_members,teams,user) {

	// LIST VIEW
  team_members.listView()
	  .title('All Team Members')
	  .fields([
	      nga.field('name'),
	      nga.field('team', 'reference')
					.label('Team')
          .targetEntity(teams)
          .targetField(nga.field('name')),
	      nga.field('dt_create', 'date').label('Created').format('short'),
	      nga.field('dt_update', 'date').label('Updated').format('short'),
	  ])
	  .sortField('name')
	  .sortDir('ASC')
	  .listActions(['show','edit','delete'])
	  .filters([
	      nga.field('name')
	          .pinned(true)
	          .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>')
	  ])

  // SHOW VIEW
  team_members.showView()
	  .title('"{{ entry.values.name }}"')
	  .fields([
	      nga.field('id'),
				nga.field('dt_create', 'date').label('Created').format('short'),
				nga.field('dt_update', 'date').label('Updated').format('short'),
				nga.field('name'),
				nga.field('email', 'email'),
				nga.field('phone').label('Phone Number'),
				nga.field('team', 'reference')
					.label('Team')
          .targetEntity(teams)
          .targetField(nga.field('name'))

		])


    // CREATION VIEW
    team_members.creationView()
    	.title('Add Team Member')
    	.fields([
    		nga.field('name'),
				nga.field('email', 'email'),
				nga.field('phone'),
				nga.field('team', 'reference')
					.label('Team')
          .targetEntity(teams)
          .targetField(nga.field('name'))
          .sortField('name')
          .sortDir('ASC')
			])


    // EDITION VIEW
    team_members.editionView()
    .title('Edit "{{ entry.values.name }}"')
    .fields(team_members.creationView().fields());
    
    // DELETION VIEW
    team_members.deletionView()
     .title('Delete "{{ entry.values.name }}"')

    return team_members;

};