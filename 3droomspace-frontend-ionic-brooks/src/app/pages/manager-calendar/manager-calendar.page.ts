import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SetManagerView } from 'src/app/state/manager/manager.action';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-manager-calendar',
  templateUrl: './manager-calendar.page.html',
  styleUrls: ['./manager-calendar.page.scss'],
})
export class ManagerCalendarPage {

  eventSource;
  viewTitle;

  isToday: boolean;
  calendar = {
      mode: 'month',
      currentDate: new Date(),
      dateFormatter: {
          formatMonthViewDay(date: Date) {
              return date.getDate().toString();
          },
          formatMonthViewDayHeader(date: Date) {
              return 'MonMH';
          },
          formatMonthViewTitle(date: Date) {
              return 'testMT';
          },
          formatWeekViewDayHeader(date: Date) {
              return 'MonWH';
          },
          formatWeekViewTitle(date: Date) {
              return 'testWT';
          },
          formatWeekViewHourColumn(date: Date) {
              return 'testWH';
          },
          formatDayViewHourColumn(date: Date) {
              return 'testDH';
          },
          formatDayViewTitle(date: Date) {
              return 'testDT';
          }
      }
  };

  constructor(
      private navController: NavController,
      private store: Store,
      ) {

  }

  loadEvents() {
      this.eventSource = this.createRandomEvents();
  }

  onViewTitleChanged(title) {
      this.viewTitle = title;
  }

  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  onCurrentDateChanged(event: Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }

  createRandomEvents() {
      const events = [];
      for (let i = 0; i < 50; i += 1) {
          const date = new Date();
          const eventType = Math.floor(Math.random() * 2);
          const startDay = Math.floor(Math.random() * 90) - 45;
          let endDay = Math.floor(Math.random() * 2) + startDay;
          let startTime;
          let endTime;
          if (eventType === 0) {
              startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
              if (endDay === startDay) {
                  endDay += 1;
              }
              endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
              events.push({
                  title: 'All Day - ' + i,
                  startTime,
                  endTime,
                  allDay: true
              });
          } else {
              const startMinute = Math.floor(Math.random() * 24 * 60);
              const endMinute = Math.floor(Math.random() * 180) + startMinute;
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
              endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
              events.push({
                  title: 'Event - ' + i,
                  startTime,
                  endTime,
                  allDay: false
              });
          }
      }
      return events;
  }

  onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date: Date) => {
      const current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  }

  goToSearch() {
    this.store.dispatch(new SetManagerView(false));
    this.store.dispatch( new Navigate(['/tabs/map']));
  }
}
