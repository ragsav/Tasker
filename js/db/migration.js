import {schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

export const xpenseDBMigration = schemaMigrations({
  migrations: [
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 1,
    },
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 11,
    },
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 12,
    },
  ],
});
