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
import {CONSTANTS} from '../../constants';
export class WTDBSync {
  /**
   *
   * @param {object} raw
   * @param {Collection} collection
   * @returns
   */
  static _backupToPrepareCreate = (raw, collection) => {
    return database.collections.get(collection.table).prepareCreate(label => {
      label._raw = sanitizedRaw({...raw}, collection.schema);
    });
  };
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

  static fetchAllLocalRecords = async ({setIsLoading, successCallback}) => {
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
      Logger.pageLogger('WTDBSync:fetchAllLocalRecords:resolvedRecords', {
        resolvedRecords,
      });
      resolvedRecords.forEach((records, index) => {
        recordsData[tables[index]] = records.map(record => {
          return {...record._raw, _changed: null, _status: null};
        });
      });

      Logger.pageLogger('WTDBSync:fetchAllLocalRecords:recordsData', {
        recordsData,
      });
      const path = RNFS.DownloadDirectoryPath + '/backup.json';
      await RNFS.writeFile(path, JSON.stringify(recordsData), 'utf8');
      setIsLoading?.(false);
      successCallback?.();
      return recordsData;
    } catch (error) {
      Logger.pageLogger('WTDBSync:fetchAllLocalRecords:catch', error);
      setIsLoading?.(false);
    }
  };

  static loadDatabase = async ({setIsLoading, recordsData}) => {
    try {
      if (typeof recordsData != 'object') return;
      setIsLoading?.(true);
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      Logger.pageLogger('WTDBSync:loadDatabase:database reset');
      // now batch the complete recreation of database

      Logger.pageLogger('WTDBSync:loadDatabase:recordsData', recordsData);

      const prepareCreateRecords = [];
      Object.keys(recordsData).forEach(tableName => {
        const collection = database.collections.get(tableName);
        console.log(collection.table);
        const tableRecords = recordsData[tableName];

        if (
          tableRecords &&
          Array.isArray(tableRecords) &&
          tableRecords.length > 0
        ) {
          tableRecords.forEach(record => {
            const preparedBatchRecord = this._backupToPrepareCreate(
              record,
              collection,
            );
            prepareCreateRecords.push(preparedBatchRecord);
          });
        }
      });
      Logger.pageLogger(
        'WTDBSync:loadDatabase:prepareCreateRecords',
        prepareCreateRecords,
      );

      await database.write(async () => {
        await database.batch(...prepareCreateRecords);
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
