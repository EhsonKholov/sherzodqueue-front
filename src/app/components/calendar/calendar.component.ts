import {Component, signal, ChangeDetectorRef, Output, EventEmitter, Input, WritableSignal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventClickArg, EventApi} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {CalendarModule} from 'primeng/calendar';
import {Subject, takeUntil} from 'rxjs';
import {RecordsService} from '../../services/records.service';
import {ToastService} from '../../services/toast.service';
import {AddEditRecordModalComponent} from '../modals/add-edit-record-modal/add-edit-record-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CalendarModule, AddEditRecordModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  private destroy$ = new Subject<void>()

  @Input() records: WritableSignal<any[]> = signal([])

  calendarVisible = signal(true);
  calendarOptions: WritableSignal<CalendarOptions> = signal({});

  startDate = signal<Date | null>(null)
  endDate = signal<Date | null>(null)

  isAddEditRecord = signal(false)

  constructor(private changeDetector: ChangeDetectorRef, private recordService: RecordsService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.createCalendarOptions()
  }

  createCalendarOptions() {
    this.calendarOptions = signal<CalendarOptions>({
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      events: this.records(),
      eventDataTransform: (data: any) => {
        return {
          title: `${data?.customer.name} ${data?.customer.surname}`, //- ${data.services.map(service => service.name).join(", ")}`,
          start: data.recordingTime,
          end: data.endTime || data.recordingTime, // Если endTime пустой, используем recordingTime как end
          description: `Доктор: ${data.employee.name}`,
          textColor: this.getTextColorByStatus(data?.status),
          backgroundColor: this.getBgColorByStatus(data?.status),
          extendedProps: {
            customer: data.customer,
            employee: data.employee,
          }
        };
      },
      eventDisplay: 'block',
      stickyHeaderDates: true,
      initialView: 'dayGridMonth',
      timeZone: 'local',
      locale: 'ru',
      //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this)
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      */
    })
  }

  handleCalendarToggle() {
    console.log('handleCalendarToggle')
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    console.log('handleWeekendsToggle')
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('handleDateSelect')
    console.log(selectInfo)

    this.startDate.set(selectInfo?.start)
    this.endDate.set(selectInfo?.end)

    this.isAddEditRecord.set(true)

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log('handleEventClick')
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    console.log('handleEvents')
    console.log('events', events)
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  getTextColorByStatus(statusCode: number) {
    switch (statusCode) {
      case 0:
        return '#fff'
      case 1:
        return '#fff'
      case 2:
        return '#fdb528'
      case 3:
        return '#72e128'
      case 4:
        return '#ff4d49'
      default:
        return ''
    }
  }

  getBgColorByStatus(statusCode: number) {
    switch (statusCode) {
      case 0:
        return '#000'
      case 1:
        return '#000'
      case 2:
        return '#fff3dd'
      case 3:
        return '#e8fadd'
      case 4:
        return '#ffe3e2'
      default:
        return ''
    }
  }

  closeAddEditRecordModal(event: any) {
    this.isAddEditRecord.set(false)
  }
}
