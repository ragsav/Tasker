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
    {
      toVersion: 15,
      steps: [
        addColumns({
          table: 'tasks',
          columns: [{name: 'reminder_id', type: 'string', isOptional: true}],
        }),
      ],
    },
    {
      toVersion: 16,
      steps: [],
    },
    {
      toVersion: 17,
      steps: [],
    },
    {
      toVersion: 18,
      steps: [],
    },
    {
      toVersion: 19,
      steps: [],
    },
    {
      toVersion: 20,
      steps: [],
    },
    {
      toVersion: 21,
      steps: [
        addColumns({
          table: 'notes',
          columns: [{name: 'password_hash', type: 'string', isOptional: true}],
        }),
      ],
    },
  ],
});
