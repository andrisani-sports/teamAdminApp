module.exports = function(nga,pitcher_workload,pitchers,user) {

	// LIST VIEW
  pitcher_workload.listView()
	  .title('All Pitcher\'s Workload')
	  .fields([
	      nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
          .targetField(nga.field('name')),
	      nga.field('game_date', 'date').label('Game Date').format('shortDate'),
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
  pitcher_workload.showView()
	  .title('Pitcher\'s Workload')
	  .fields([
	      nga.field('id'),
				nga.field('dt_create', 'date').label('Created').format('short'),
				nga.field('dt_update', 'date').label('Updated').format('short'),
				nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
          .targetField(nga.field('name')),
	      nga.field('game_date', 'date').label('Game Date').format('shortDate'),
	      nga.field('number_innings').label('Inning Count'),
	      nga.field('number_pitches').label('Ptich Count'),
	      nga.field('note', 'wysiwyg')
		])


    // CREATION VIEW
    pitcher_workload.creationView()
    	.title('Add Pitcher\'s Workload')
    	.fields([
    		nga.field('pitcher', 'reference')
					.label('Pitcher')
          .targetEntity(pitchers)
          .targetField(nga.field('name'))
          .sortField('name')
          .sortDir('ASC'),
	      nga.field('game_date', 'date').label('Game Date'),
	      nga.field('number_innings').label('Inning Count'),
	      nga.field('number_pitches').label('Ptich Count'),
	      nga.field('note', 'wysiwyg')
    		
			])


    // EDITION VIEW
    pitcher_workload.editionView()
    .title('Edit Pitcher\'s Workload')
    .fields(pitcher_workload.creationView().fields());
    
    // DELETION VIEW
    pitcher_workload.deletionView()
     .title('Delete Pitcher\'s Workload')

    return pitcher_workload;
};