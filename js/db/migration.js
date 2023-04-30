import {schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

export const taskerDBMigrations = schemaMigrations({
  migrations: [
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 1,
    },
    {
      toVersion: 2,
      // steps: [
      //   addColumns({
      //     table: 'notes',
      //     columns: [{name: 'password_hash', type: 'string', isOptional: true}],
      //   }),
      // ],
    },
  ],
});
