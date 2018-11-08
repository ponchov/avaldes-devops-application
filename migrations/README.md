# Migrations

Migrations are being handled by sequelize, to learn more read the [documentation](http://docs.sequelizejs.com/manual/tutorial/migrations.html).

### Running migrations

You can run all migrations and seeders by doing `npm run migrate-up` from command line at the root of the repo.


You can run all migrations by doing `npm run migrate-run` from command line at the root of the repo.

### Reverting migrations

You can revert a new migration by doing `npm run migrate-undo` from command line at the root of the repo.

### Creating migration

You can create a new migration by doing `npm run migrate-create` from command line at the root of the repo.

It will generate a new file named similar to `migrations/20170719151546-unnamed-migration.js`.

In that file there will be an up and a down.

```
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return await queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return await queryInterface.dropTable('users');
    */
  }
};
```

This allows powerful usage of models from the js level of the code, also allows raw SQL.
Please use async/await for all migrations.
