import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {xpenseDBMigration} from './migration';

import {xpenserSchema} from './schema';
import Task from './models/Task';
import Note from './models/Note';
import Label from './models/Label';
const adapter = new SQLiteAdapter({
  schema: xpenserSchema,

  dbName: 'xnoteDB', // optional database name or file system path
  // migrations, // optional migrations
  jsi: false,
});

export const database = new Database({
  adapter,
  modelClasses: [Task, Note, Label],
});