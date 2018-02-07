const tableName = 'points';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments();
        table.integer('user_id');
        table.foreign('user_id').references('users.id');
        table.integer('entry');
        table.biginteger('created_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(tableName);
};
