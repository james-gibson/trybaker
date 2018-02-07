const tableName = 'users';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments();
        table.string('firstName');
        table.string('lastName');
        table.string('phoneNumber');
        table.boolean('validatedPhoneNumber');
        table.boolean('validatedEmailAddress');
        table.string('emailAddress');
        table.biginteger('created_at');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists(tableName);
};
