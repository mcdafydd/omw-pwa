import Dexie from 'dexie';
import { v4 as uuidv4 } from '../web_modules/uuid.js';

export interface IEntry {
  id?: string;
  timesheetId?: string;
  start: Date;
  end: Date;
  task: string;
  notes?: string;
}

export interface ISetting {
  key: string;
  value: any;
  timesheetId?: string;
}

export class Timesheet {
  name: string;
  id: string;
  active?: boolean;
  createdOn?: Date;
  constructor(name: string, id: string, active?: boolean, createdOn?: Date) {
    this.name = name;
    this.id = id;
    if (active) this.active = active
      else active = true;
    if (createdOn) this.createdOn = createdOn
      else createdOn = new Date();
  }
}

export class Entry implements IEntry {
  id?: string;
  timesheetId?: string;
  start: Date;
  end: Date;
  task: string;
  notes?: string;
  constructor(
    start: Date,
    end: Date,
    task: string,
    notes?: string,
    id?: string,
    timesheetId?: string,
  ) {
    this.start = start;
    this.end = end;
    this.task = task;
    if (notes) this.notes = notes
      else this.notes = '';
    if (timesheetId) this.timesheetId = timesheetId
    if (id) this.id = id;
  }
}

export class OmwDB extends Dexie {
  timesheets: Dexie.Table<Timesheet, [string, string]>;
  entries: Dexie.Table<IEntry, string>;
  settings: Dexie.Table<ISetting, number>;

  constructor() {
      super("omwdb", { autoOpen: false });
      this.version(2).stores({
        timesheets: '++, &[timesheetName+id], createdOn',
        entries: '$$id, timesheetId, start, end, task, notes',
        settings: '++, &key, timesheetId'
      });
      // The following line is needed if your typescript
      // is compiled using babel instead of tsc:
      this.timesheets = this.table("timesheets");
      this.entries = this.table("entries");
      this.settings = this.table("settings");

      this.timesheets.mapToClass(Timesheet);
      this.entries.mapToClass(Entry);

      this.open().catch(err => {
        console.error(`Open failed: ${err.stack}`);
      });
      const id = uuidv4();
      this.timesheets.add({
        name: 'main',
        id: id,
        active: true
      })
      .then(() => {
        this.settings.put({
          key: 'primaryTimesheetId',
          value: id
        });
      }).catch(err => {
        console.error(`Failed to create new timesheet.  Already exists? Error: ${err.stack}`);
      });;
  }
}

