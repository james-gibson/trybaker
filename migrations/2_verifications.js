const tableName = 'verifications';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments();
        table.enu('type', ['EMAIL', 'PHONE']);
        table.integer('userId');
        table.foreign('userId').references('users.id');
        table.string('expectedCode');
        table.string('expectedValue');
        table.biginteger('created_at');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(tableName);
};