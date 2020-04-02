import '../web_modules/dexie-export-import.js';
import '../web_modules/dexie-observable.js';
import {OmwDB} from './model.js';

const db = new OmwDB();

// Default settings values
db.on('populate', () => {
  const defaultStartOfDay = new Date(1970, 1, 1, 8, 30, 0, 0);
  db.settings.put({
    key: 'startOfDay',
    value: defaultStartOfDay
  });
});

export default db;
