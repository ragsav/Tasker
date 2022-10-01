import {synchronize} from '@nozbe/watermelondb/sync';
import {Storage} from '../utils/asyncStorage';
import {Logger} from '../utils/logger';
import {database} from './db';
import {Collection, Q, Model} from '@nozbe/watermelondb';
import {sanitizedRaw} from '@nozbe/watermelondb/RawRecord';
import RNFS from 'react-native-fs';
import Label from './models/Label';
import Note from './models/Note';
import Task from './models/Task';
export class WTDBSync {
  static _prepareCreateFromDirtyRaw(collection, dirtyRaw) {
    const sanitized = sanitizedRaw(dirtyRaw, collection.schema);
    const record = new Model(collection, sanitized);
    record._preparedState = 'create';
    return record;
  }
  static prepareCreateCollectionWise = (table, records) => {
    // console.log({table, records});
    const collection = database.collections.get(table);

    const batch = [];
    records.forEach(dirtyRaw => {
      let batchItem;
      if (collection.table === 'labels') {
        batchItem = Label._backupToPrepareCreate(
          sanitizedRaw(dirtyRaw, collection.schema),
        );
      }
      if (collection.table === 'notes') {
        batchItem = Note._backupToPrepareCreate(
          sanitizedRaw(dirtyRaw, collection.schema),
        );
      }
      if (collection.table === 'tasks') {
        batchItem = Task._backupToPrepareCreate(
          sanitizedRaw(dirtyRaw, collection.schema),
        );
      }
      console.log({batchItem});
      batch.push(batchItem);
    });
    // console.log({table, batch});
    return batch;
  };

  static fetchAllLocalRecords = async setIsLoading => {
    try {
      setIsLoading?.(true);
      const tables = Object.keys(database.collections.map);
      Logger.pageLogger(
        'WTDBSync:fetchAllLocalRecords:tables retrieved',
        tables,
      );
      const promiseRecords = [];
      const recordsData = {};
      tables.forEach(table => {
        promiseRecords.push(database.collections.get(table).query().fetch());
      });

      const resolvedRecords = await Promise.all(promiseRecords);
      resolvedRecords.forEach((records, index) => {
        recordsData[tables[index]] = records.map(record => {
          return {...record._raw};
        });
      });
      Logger.pageLogger('WTDBSync:fetchAllLocalRecords:recordsData', {
        recordsData,
      });
      const path = RNFS.DownloadDirectoryPath + '/backup.json';
      await RNFS.writeFile(path, JSON.stringify(recordsData), 'utf8');
      setIsLoading?.(false);
      return recordsData;
    } catch (error) {
      Logger.pageLogger('WTDBSync:fetchAllLocalRecords:catch', error);
      setIsLoading?.(false);
    }
  };

  static loadDatabase = async ({setIsLoading, recordsData}) => {
    try {
      setIsLoading?.(true);
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      Logger.pageLogger('WTDBSync:loadDatabase:database reset');
      // now batch the complete recreation of database

      Logger.pageLogger('WTDBSync:loadDatabase:recordsData', recordsData);
      var batch = [];
      Object.keys(recordsData).forEach(table => {
        const _localBatch = this.prepareCreateCollectionWise(
          table,
          recordsData[table],
        );
        console.log({_localBatch, table});
        batch = batch.concat(_localBatch);
      });

      await database.write(async () => {
        await database.batch(...batch);
      });
      Logger.pageLogger('WTDBSync:loadDatabase:success');
      setIsLoading?.(false);
    } catch (error) {
      Logger.pageLogger('WTDBSync:loadDatabase:catch', error);
      setIsLoading?.(false);
    }
    // first clear the database
  };
}
