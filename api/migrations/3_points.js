const tableName = 'points';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments();
        table.integer('userId');
        table.foreign('userId').references('users.id');
        table.integer('entry');
        table.biginteger('created_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(tableName);
};
