
module.exports = {
  debug: true,
  development: {
    client: 'pg',
    connection: 'postgres://BAKER:TRYBAKERPASSWORD@db:5432',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
