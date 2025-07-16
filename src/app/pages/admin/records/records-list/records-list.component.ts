import {Component, Input, OnInit, output, signal, WritableSignal} from '@angular/core';
import {RecordsService} from '../../../../services/records.service';
import {ToastService} from '../../../../services/toast.service';
import {Subject, takeUntil} from 'rxjs';
import {AddEditRecordModalComponent} from '../../../../components/modals/add-edit-record-modal/add-edit-record-modal.component';
import {CalendarModule} from 'primeng/calendar';
import {PrimeNGConfig} from 'primeng/api';
import moment from 'moment';

@Component({
  selector: 'app-records-list',
  standalone: true,
  imports: [
    AddEditRecordModalComponent,
    CalendarModule
  ],
  templateUrl: './records-list.component.html',
  styleUrl: './records-list.component.scss',
  animations: [

  ]
})
export class RecordsListComponent implements OnInit {

  private destroy$ = new Subject<void>()
  records: WritableSignal<any[]> = signal([])
  groupedRecords: WritableSignal<any[]> = signal([])
  employees: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0

  @Input() set addRecord(arg: boolean) {
    this.addRecordFn(arg)
  }

  addRecordModalShow = signal(false)
  record = signal(null)

  closeAddRecord = output<any>()
  selectedDate = signal(new Date())



  // Массив для отображения временной шкалы
  public timeSlots: string[] = [];

  // Параметры сетки
  public startHour = 8;
  public endHour = 19;
  public timeIntervalMinutes = 30; // интервал в минутах

  // Высота одной строки в пикселях (важно, чтобы совпадало с CSS)
  public rowHeight = 40;
  public totalRows = 0;


  constructor(
    private recordService: RecordsService,
    private toastService: ToastService,
    private primengConfig: PrimeNGConfig,
  ) {
  }

  ngOnInit() {
    this.getRecords()
    this.generateTimeSlots()

    this.primengConfig.setTranslation(
      {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторники', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        //monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Сегодня',
        clear: 'Очистить',
      }
    );
  }

  getRecords() {
    let fromDate = moment(this.selectedDate()).startOf('day')
    let toDate = moment(this.selectedDate()).endOf('day')

    let body = {
      includeDependencies: true,
      fromDate: fromDate.format(),
      toDate: toDate.format()
    }

    this.recordService.getRecordsList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.records.set(res?.items)
          this.groupedRecords.set(this.groupDataByEmployee(res?.items))

          console.log('groupedRecords', this.groupedRecords())

          this.page_num = res?.page
          this.page_size = res?.pageSize
          this.totalElements = res?.totalCount
          this.total_pages = (this.totalElements / this.page_size) + (this.totalElements % this.page_size > 0 ? 1 : 0)
        }, error: (error: any) => {
          if (error.status != 401) return
          this.toastService.error('Ошибка получения данных!')
        }
      })
  }

  groupDataByEmployee(data: any[]): any[] {
    const groupedMap = data.reduce((acc, record) => {
      const employeeId = record.employee.id;

      if (!acc[employeeId]) {
        acc[employeeId] = record.employee
        acc[employeeId].records = []
      }

      acc[employeeId].records.push(record);

      return acc;
    }, {} as { [key: number]: any });

    return Object.values(groupedMap);
  }

  addRecordFn(arg: boolean) {
    this.addRecordModalShow.set(arg)
    this.record.set(null)
  }

  closeAddRecordModal(event: any) {
    this.addRecordModalShow.set(event)
    this.closeAddRecord.emit(null)
    this.record.set(null)
  }


  // Генерация временных меток для левой колонки
  private generateTimeSlots(): void {
    this.totalRows = (this.endHour - this.startHour) * (60 / this.timeIntervalMinutes);
    for (let i = 0; i < this.totalRows; i++) {
      const totalMinutes = this.startHour * 60 + i * this.timeIntervalMinutes;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  // Ключевая функция для позиционирования записи
  getAppointmentStyle(record: any) {
    const startTime = new Date(record.recordingTime);
    const endTime = new Date(record.endTime || record.recordingTime);

    const startMinutes = (startTime.getHours() - this.startHour) * 60 + startTime.getMinutes();
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    const top = (startMinutes / this.timeIntervalMinutes) * this.rowHeight;
    const height = (durationMinutes / this.timeIntervalMinutes) * this.rowHeight;

    return {
      top: `${top}px`,
      height: height <= 0 ? 'auto' : `${height}px`
    };
  }

  getAppointmentStyleByTime(time: string) {
    const [startTime, endTime] = time.split(':')

    const startMinutes = (Number.parseInt(startTime) - this.startHour) * 60 + Number.parseInt(endTime);
    const top = (startMinutes / this.timeIntervalMinutes) * this.rowHeight;

    return {
      top: `${top}px`
    };
  }

  manyBlocksTake(record: any) {
    const startTime = new Date(record.recordingTime);
    const endTime = new Date(record.endTime || record.recordingTime);

    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    return durationMinutes > 20
  }

  getRecordByTime(time: string, employee: any) {
    let idx = employee?.records?.findIndex((r: any) => {
      // 1. Получаем время из полной даты
      const dateObj = new Date(r?.recordingTime);
      const minutesFromDate = dateObj.getHours() * 60 + (dateObj.getMinutes()); // 0 * 60 + 0 = 0

      // 2. Получаем время из строки HH:mm
      const [hours, minutes] = time.split(':').map(Number);
      const minutesTime = hours * 60 + minutes; // 8 * 60 + 0 = 480
      const minutesTimeNext = hours * 60 + minutes + 30; // 8 * 60 + 30 = 510

      // 3. Сравниваем числа
      return minutesFromDate >= minutesTime && minutesFromDate <= minutesTimeNext
    })

    if (idx > -1) {
      return employee?.records[idx]
    }

    return null;
  }

  editRecord(record: any) {
    console.log('record', record)
    this.record.set(record)
    this.addRecordModalShow.set(true)
  }

  selectDate(date: Date) {
    this.selectedDate.set(date)
    this.getRecords()
  }

  protected readonly Array = Array;

  createRecord() {
    this.record.set(null)
    this.addRecordModalShow.set(true)
  }

  protected readonly moment = moment;
}
