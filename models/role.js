module.exports = function(nga,role) {

    // LIST VIEW
    role.listView()
    .title('User Roles')
    .fields([
        nga.field('_id'),
        nga.field('name').cssClasses('capitalize')
    ])
    .listActions(['show','edit','delete']);

    // SHOW VIEW
    role.showView()
    .title('"{{ entry.values.name }}" role')
    .fields([
        nga.field('_id'),
        nga.field('name').cssClasses('capitalize col-sm-10 col-md-8 col-lg-7')
    ])

    return role;

};