// LitElement and html are the basic required imports
import {LitElement, html, css} from '/web_modules/lit-element.js';

// Import 3rd party
import { Calendar } from '/web_modules/@fullcalendar/core.js';
import dayGridPlugin from '/web_modules/@fullcalendar/daygrid.js';
import interactionPlugin from '/web_modules/@fullcalendar/interaction.js';
import timeGridPlugin from '/web_modules/@fullcalendar/timegrid.js';
import momentTimezonePlugin from '/web_modules/@fullcalendar/moment-timezone.js';
import '/web_modules/@material/mwc-fab.js';
import '/web_modules/weightless.js';

import db from '../db.js';

class FullCalendar extends LitElement {
  static get properties() {
    return {
      startOfDay: { type: Object },

      calendar: { type: Object },
      header: { type: Object },
      events: { type: Array },
      weekends: { type: Boolean },
      dir: { type: String },
      hiddenDays: { type: Array },
      disableFixedWeekCount: { type: Boolean },
      weekNumbers: { type: Boolean },
      businessHours: { type: Object },
      height: { type: Number },
      defaultDate: { type: Object },
      defaultTimedEventDuration: { type: String },
      editable: { type: Boolean },
      selectable: { type: Boolean },
      selectMirror: { type: Boolean },
      droppable: { type: Boolean },
      aspectRatio: { type: Number },
      eventStartEditable: { type: Boolean },
      eventDurationEditable: { type: Boolean },
      eventResizableFromStart: { type: Boolean },
      forceEventDuration: { type: Boolean },
      defaultView: { type: String },
      allDaySlot: { type: Boolean },
      allDayText: { type: String },
      slotDuration: { type: String },
      slotLabelInterval: { type: Object },
      snapDuration: { type: Object },
      scrollTime: { type: String },
      minTime: { type: String },
      maxTime: { type: String },
      slotEventOverlap: { type: Boolean },
      nowIndicator: { type: Boolean },
      dragRevertDuration: { type: Number },
      dragOpacity: { type: Number },
      dragScroll: { type: Boolean },
      eventColor: { type: String },
      eventConstraint: { type: Object },
      eventLimit: { type: String },
      eventOverlap: { type: Object },
      eventRender: { type: Object },
      locale: { type:  String },
      timeFormat: { type: String },
      timeZone: { type: String },
      backgroundColor: { type: String },
      borderColor: { type: String },
      textColor: { type: String },
      dayRender: { type: Object },
      options: { type: Object },
      categories: { type: Array },
      config: { type: Object }, // allows user to override default _config object
    };
  }

  static get availableViews() {
    return ["dayGridMonth", "dayGridDay", "dayGridWeek", "timeGridWeek", "timeGridDay", "listYear", "listMonth", "listWeek", "listDay"];
  }

  static get defaultColors() {
    return ["#1abc9c", "#3498db", "#f1c40f", "#8e44ad", "#e74c3c", "#d35400", "#2c3e50", "#7f8c8d"];
  }

  constructor() {
    super();
    this.db = db;
    this.config = {};
    this.calendar = {};
    this.aspectRatio = 1.35;
    this.categories = [];
    this.defaultView = 'dayGridWeek';
    this.defaultTimedEventDuration = '00:15';
    this.dir = 'ltr';
    this.editable = true;
    this.eventLimit = true;
    this.eventResizableFromStart = true;
    this.forceEventDuration = true;
    this.header = {left:"prev,next",center:"dayGridMonth,timeGridWeek,timeGridDay",right:"today"};
    this.minTime = "00:00:00";
    this.maxTime = "24:00:00";
    this.selectable = true;
    this.timeZone = 'US/Central';
    this.weekends = true;

    // Default startOfDay if not set in settings DB
    // Ignore everything except hour and minute in usage
    // FIXME: pull this from settings db
    this.startOfDay = new Date(1970, 1, 1, 8, 30, 0, 0);

    // Construct calendar's default config object
    this._config = {
      plugins: [dayGridPlugin, interactionPlugin, momentTimezonePlugin, timeGridPlugin],
      defaultView: 'dayGridWeek',
      dir: this.dir,
      theme: false,
      header: this.header,
      editable: this.editable,
      minTime: this.minTime,
      maxTime: this.maxTime,
      nowIndicator: true,
      eventLimit: this.eventLimit,
      forceEventDuration: this.forceEventDuration,
      selectable: this.selectable,
      selectMirror: this.selectMirror,
      // select: info=>console.log('select'),
      // dateClick: info=>console.log('dateClick'),
      events: this.getEvents.bind(this),

      // Event handlers
      eventClick: info => {
        // display mwc-fab upper right corner and run info.event.remove() if clicked icon mini
        const fab = document.createElement('mwc-fab');
        fab.icon ='clear';
        fab.mini = true;
        fab.classList.add("fab");
        fab.onclick = () => {
          this.db.entries.delete(info.event.id).then(() => {
            info.event.remove();
            this.sendAlert('Event deleted');
          }).catch(err => {
            const errMsg = `Failed to delete event`;
            console.error(`${errMsg}: ${err.stack || err}`);
            this.sendAlert(errMsg, 'red');
          });
        };
        info.el.firstElementChild.appendChild(fab);
        this.dispatchEvent(new CustomEvent('event-click', { detail: { info } }));
      },
      eventDestroy: info => {
        if (!info.isMirror) {
          if (Object.prototype.hasOwnProperty.call(info.event.extendedProps.tip, 'destroy')) {
            info.event.extendedProps.tip.destroy();
          }
        }
      },
      eventDrop: info => {
        const successCallback = () => { this.sendAlert('Event moved'); };
        this.updateEvent(info, successCallback, info.revert);
        this.dispatchEvent(new CustomEvent('event-drop', { detail: { info } }));
      },
      eventMouseEnter: info => {
        const tooltip = this.shadowRoot.querySelector('wl-tooltip');
        tooltip.anchor = info.el;
        tooltip.innerHTML = `${info.event.title}: ${info.event.extendedProps.notes}`;
        tooltip.open = '';
      },
      eventMouseLeave: info => {
        const tooltip = this.shadowRoot.querySelector('wl-tooltip');
        tooltip.anchor = info.el;
        tooltip.innerHTML = `${info.event.title}: ${info.event.extendedProps.notes}`;
        delete(tooltip.open);
      },
      eventRender: info => {
        // <wl-tooltip anchor="#auto-open-button" .anchorOpenEvents="${["mouseover"]}" .anchorCloseEvents="${["mouseout"]}" fixed>...</wl-tooltip>
       // tooltip.anchorOpenEvents = ['event-mouse-enter'];
       // tooltip.anchorCloseEvents = ['event-mouse-leave'];
      //  tooltip.appendChild(this.shadowRoot);
//        tooltip.appendChild(info.el);
//        info.event.setExtendedProps('tip', tip);
        this.dispatchEvent(new CustomEvent('event-render', { detail: { info } }));
      },
      eventResize: info => {
        const successCallback = () => { this.sendAlert('Event resized'); };
        this.updateEvent(info, successCallback, info.revert);
        this.dispatchEvent(new CustomEvent('event-resize', { detail: { info } }));
      }
    };
  }

  static get styles() {
      return css`
	      :host {
          display: block;
        }

        .hide {
          display: none !important;
        }

        .show {
          display: block !important;
        }

        .fc-scroller {
          height: auto !important;
          overflow-y: hidden !important;
        }

        .breakEntry {
          color: lavender;
        }

        .ignoreEntry {
          color: beige;
        }

        .tooltip {
          background-color: var(--mdc-theme-primary);
          color: var(--mdc-theme-secondary);
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--omw-font-family);
        }

        .fab {
          display: inline-block;
          text-align: center;
          color: #fff;
          font-size: 1.2rem;
          line-height: 40px;
          position: absolute;
          right: 15px;
          bottom: 10px;
        }
        `
  }

  render() {
    return html`
      <link href='/css/core/main.min.css' rel='stylesheet' />
      <link href='/css/daygrid/main.min.css' rel='stylesheet' />
      <link href='/css/timegrid/main.min.css' rel='stylesheet' />

      <div id="calendar"><wl-tooltip class="tooltip" role="tooltip"></wl-tooltip></div>`
  }

  firstUpdated(){
    const config = this._config;
    this.db.on('ready', () => {
      this.db.settings.get('startOfDay')
      .then(item => {
        if (item !== undefined) {
          this.startOfDay = item.value;
        }
      });
    });

    /*
    this.db.settings.where('key').equals('startOfDay').toArray()
    .then(items => {
      if (items.length === 1) {
        this.startOfDay = items[0].value;
      }
    });*/

    const calendarEl = this.shadowRoot.getElementById('calendar');
    const calendar = new Calendar(calendarEl, config);
    this.calendar = calendar;
    calendar.render();

    window.addEventListener('my-getEvents', () => {
      console.log('Updating events');
      const root = document.querySelector('omw-app');
      const el = root.shadowRoot.querySelector('omw-track').shadowRoot.querySelector('full-calendar');
      const eventSources = el.calendar.getEventSources();
      if (eventSources[0]) {
        eventSources[0].refetch();
      }
      el.calendar.render();
    });
  }

  getEvents(info, successCallback, failureCallback) {
/*  FIXME: query current or selected timesheets only
    .where('timesheetId')
  .equals(primaryTimesheetId)*/
    this.db.entries
    .where("end")
    .between(info.start, info.end)
    .sortBy("start")
    .then(entries => {
      let start = this.startOfDay;
      let currentDay = (new Date()).getDay();
      let dayStarted = false;
      const mapped = Array.prototype.slice.call(entries).map((entry) => {
        const d = new Date(entry.end);
        if (dayStarted === true && d.getDay() !== currentDay) {
          dayStarted = false;
        }
        if (dayStarted === false && entry.task === 'hello') {
          dayStarted = true;
          start = new Date(entry.end);
          start = new Date(start.setMinutes(start.getMinutes() - 15));
        } else if (dayStarted === false) {
          dayStarted = true;
          start = this.startOfDay;
        }
        console.log('ENTRY END', entry.end);
        const item = {
          classNames: [],
          id: entry.id,
          title: entry.task,
          start: entry.start !== '' ? entry.start : start,
          end: entry.end,
          url: '',
          extendedProps: {
            notes: entry.notes,
            tip: {} // this property should not be persisted by Dexie
          },

        };
        currentDay = d.getDay();
        start = d;
        return item;
      });
      return successCallback(mapped);
    })
    .catch( err => failureCallback(err));
  }

  sendAlert(message) {
    const event = new CustomEvent('alert-user', {
      bubbles: true,
      composed: true,
      detail: {
        message
      }
    });
    this.dispatchEvent(event);
  }

  updated(changedProperties) {
/*    if (Object.prototype.hasOwnProperty.call(changedProperties, 'reRender')) {
      if (changedProperties.reRender) {
        this.calendar.render();
      }
    }*/
  }

  updateEvent(info, successCallback, failureCallback) {
    console.dir(info);
    this.db.entries.update(info.event.id, {
      start: info.event.start,
      end: info.event.end
    })
    .then(updated => {
      if (updated) {
        return successCallback();
      }
      throw new Error('Failed to update event');
    })
    .catch(err => {
      const errMsg = `Failed to update event`
      console.error(`${errMsg}: ${err.stack || err}`);
      this.sendAlert(errMsg, 'red');
      return failureCallback();
    });
  }
}

customElements.define('full-calendar', FullCalendar);
