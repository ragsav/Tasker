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
export class WTDBBackup {
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

  static fetchAllLocalRecords = async ({setIsLoading, successCallback}) => {
    try {
      setIsLoading?.(true);
      const tables = Object.keys(database.collections.map);
      Logger.pageLogger(
        'WTDBBackup:fetchAllLocalRecords:tables retrieved',
        tables,
      );
      const promiseRecords = [];
      const recordsData = {};

      tables.forEach(table => {
        promiseRecords.push(database.collections.get(table).query().fetch());
      });

      const resolvedRecords = await Promise.all(promiseRecords);
      Logger.pageLogger('WTDBBackup:fetchAllLocalRecords:resolvedRecords', {
        resolvedRecords,
      });
      resolvedRecords.forEach((records, index) => {
        recordsData[tables[index]] = records.map(record => {
          return {...record._raw, _changed: null, _status: null};
        });
      });

      Logger.pageLogger('WTDBBackup:fetchAllLocalRecords:recordsData', {
        recordsData,
      });
      const path = RNFS.DownloadDirectoryPath + '/backup.json';
      await RNFS.writeFile(path, JSON.stringify(recordsData), 'utf8');
      setIsLoading?.(false);
      successCallback?.();
      return recordsData;
    } catch (error) {
      Logger.pageLogger('WTDBBackup:fetchAllLocalRecords:catch', error);
      setIsLoading?.(false);
    }
  };

  static loadDatabase = async ({
    setIsLoading,
    recordsData,
    successCallback,
  }) => {
    try {
      if (typeof recordsData != 'object') return;
      setIsLoading?.(true);
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      Logger.pageLogger('WTDBBackup:loadDatabase:database reset');
      // now batch the complete recreation of database

      Logger.pageLogger('WTDBBackup:loadDatabase:recordsData', recordsData);

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
        'WTDBBackup:loadDatabase:prepareCreateRecords',
        prepareCreateRecords,
      );

      await database.write(async () => {
        await database.batch(...prepareCreateRecords);
      });

      Logger.pageLogger('WTDBBackup:loadDatabase:success');
      setIsLoading?.(false);
      successCallback?.();
    } catch (error) {
      Logger.pageLogger('WTDBBackup:loadDatabase:catch', error);
      setIsLoading?.(false);
    }
    // first clear the database
  };
}
