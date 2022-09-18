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
    {
      toVersion: 13,
      steps: [
        addColumns({
          table: 'tasks',
          columns: [{name: 'done_timestamp', type: 'number', isOptional: true}],
        }),
      ],
    },
    {
      toVersion: 14,
      steps: [
        addColumns({
          table: 'tasks',
          columns: [
            {name: 'description', type: 'string', isOptional: true},
            {name: 'repeat_cron', type: 'string', isOptional: true},
          ],
        }),
      ],
    },
  ],
});
