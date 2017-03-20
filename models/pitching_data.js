module.exports = function(nga,pitching_data,pitchers,pitcher_workload,user) {

	// LIST VIEW
  pitching_data.listView()
	  .title('All Pitching Data')
	  .fields([
	      nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
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
  pitching_data.showView()
	  .title('Pitching Data')
	  .fields([
	      nga.field('id'),
				nga.field('dt_create', 'date').label('Created').format('short'),
				nga.field('dt_update', 'date').label('Updated').format('short'),
				nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
          .targetField(nga.field('name')),
        nga.field('pulls'),
        nga.field('note', 'wysiwyg')
		])


    // CREATION VIEW
    pitching_data.creationView()
    	.title('Add Pitching Data')
    	.fields([
    		nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
          .targetField(nga.field('name'))
          .sortField('name')
          .sortDir('ASC'),
        nga.field('pulls', 'json'),
        nga.field('note', 'wysiwyg')
    		
			])


    // EDITION VIEW
    pitching_data.editionView()
    .title('Edit Pitching Data')
    .fields(pitching_data.creationView().fields());
    
    // DELETION VIEW
    pitching_data.deletionView()
     .title('Delete Pitching Data')

    return pitching_data;
};