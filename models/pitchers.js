module.exports = function(nga,pitchers,teams,user) {

	// LIST VIEW
  pitchers.listView()
	  .title('All Pitchers')
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
  pitchers.showView()
	  .title('"{{ entry.values.name }}"')
	  .fields([
	      nga.field('id'),
	      nga.field('unique_id').label('Unique ID'),
				nga.field('dt_create', 'date').label('Created').format('short'),
				nga.field('dt_update', 'date').label('Updated').format('short'),
				nga.field('name'),
				nga.field('age'),
				nga.field('height').label('Height (inches)'),
				nga.field('weight').label('Weight (lbs)'),
				nga.field('stride_length').label('Stride Length (inches)'),
				nga.field('device_height').label('Device Height (inches)'),
				nga.field('team', 'reference')
					.label('Team')
          .targetEntity(teams)
          .targetField(nga.field('name'))
				// nga.field('baselines')
		])


    // CREATION VIEW
    pitchers.creationView()
    	.title('Add Pitcher')
    	.fields([
    		nga.field('name'),
    		nga.field('age'),
				nga.field('height').label('Height (inches)'),
				nga.field('weight').label('Weight (lbs)'),
				nga.field('stride_length').label('Stride Length (inches)'),
				nga.field('device_height').label('Device Height (inches)'),
				nga.field('team', 'reference')
					.label('Team')
          .targetEntity(teams)
          .targetField(nga.field('name'))
          .sortField('name')
          .sortDir('ASC')
			])


    // EDITION VIEW
    pitchers.editionView()
    .title('Edit "{{ entry.values.name }}"')
    .fields(pitchers.creationView().fields());
    
    // DELETION VIEW
    pitchers.deletionView()
     .title('Delete "{{ entry.values.name }}"')

    return pitchers;
};