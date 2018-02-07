const tableName = 'verifications';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments();
        table.enu('type', ['EMAIL', 'PHONE']);
        table.string('expectedCode');
        table.string('expectedValue');
        table.biginteger('created_at');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(tableName);
};