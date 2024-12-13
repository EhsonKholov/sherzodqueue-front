import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ChartComponent} from 'ng-apexcharts';
import {ReportsService} from '../../../services/reports.service';
import {Subject, takeUntil} from 'rxjs';
import {UtilsService} from '../../../services/utils.service';
import {SkeletonModule} from 'primeng/skeleton';

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  colors?: ApexColorStop;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    ChartComponent,
    SkeletonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private destroy$ = new Subject<void>();

  months = [
    {name: 'Январь', number: 1},
    {name: 'Февраль', number: 2},
    {name: 'Март', number: 3},
    {name: 'Апрель', number: 4},
    {name: 'Май', number: 5},
    {name: 'Июнь', number: 6},
    {name: 'Июль', number: 7},
    {name: 'Август', number: 8},
    {name: 'Сентябрь', number: 9},
    {name: 'Октябрь', number: 10},
    {name: 'Ноябрь', number: 11},
    {name: 'Декабрь', number: 12}
  ]

  daysOfWeek = [
    {english: 'Monday', russian: 'Понедельник', rusShort: 'Пн'},
    {english: 'Tuesday', russian: 'Вторник', rusShort: 'Вт'},
    {english: 'Wednesday', russian: 'Среда', rusShort: 'Ср'},
    {english: 'Thursday', russian: 'Четверг', rusShort: 'Чт'},
    {english: 'Friday', russian: 'Пятница', rusShort: 'Пт'},
    {english: 'Saturday', russian: 'Суббота', rusShort: 'Сб'},
    {english: 'Sunday', russian: 'Воскресенье', rusShort: 'Вс'}
  ]

  public annualBudgetChartOptions: Partial<ChartOptions> | any;
  public dailyRecordsChartOptions: Partial<ChartOptions> | any;
  public dailyRecordsColumnChartOptions: Partial<ChartOptions> | any;

  annualBudget: WritableSignal<any[]> = signal([]);
  dailyRecords: WritableSignal<any[]> = signal([]);

  constructor(private reportsService: ReportsService, private utils: UtilsService) {
  }

  ngOnInit(): void {
    this.getAnnualBudget()
    this.getDailyRecords()
  }

  getDailyRecords() {
    this.reportsService.getDailyRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.dailyRecords.set(res?.data)
          this.fillDailyRecords()
        }
      })
  }

  fillDailyRecords() {
    /*
    {
      "date": "30-11-2024",
      "dateOfWeek": "Saturday",
      "totalAmount": 0,
      "totalRecords": 0,
      "completedRecords": 0,
      "canceledRecords": 0,
      "inPorgressRecrods": 0,
      "inLineRecords": 0
    },
    */
    let completedRecords = []
    let canceledRecords = []
    let totalRecords = []
    let categories = []
    let categoriesShort = []
    for (let a of this.dailyRecords()) {
      let week = this.daysOfWeek.find(m => m.english == a.dateOfWeek)
      categories.push(week?.russian)
      categoriesShort.push(week?.rusShort)
      completedRecords.push(a.completedRecords)
      canceledRecords.push(a.canceledRecords)
      totalRecords.push(a.totalRecords)
    }


    this.dailyRecordsChartOptions = {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        selection: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        }
      },
      colors: ["#005a01", "#9c0c1b"],
      series: [
        {
          name: "Успешные записи",
          data: completedRecords
        },
        {
          name: "Отклоненные записи",
          data: canceledRecords
        }
      ],
      title: {
        text: "За неделю"
      },
      xaxis: {
        categories: categories
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: "right",
        offsetX: 40
      }
    }

    this.dailyRecordsColumnChartOptions = {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        selection: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        }
      },
      series: [
        {
          type: 'column',
          name: 'Общее количество',
          data: totalRecords
        },
      ],
      xaxis: {
        categories: categoriesShort
      },
      title: {
        text: "За неделю"
      },
      legend: {
        show: false,
        /*floating: true,
        position: 'top',
        horizontalAlign: "left",
        offsetX: 40*/
      }
    }
  }

  getAnnualBudget() {
    this.reportsService.getAnnualBudget()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.annualBudget.set(res?.data)
          this.fillAnnualBudget()
        }
      })
  }

  fillAnnualBudget() {
    /*
    {
      "month": "12-2023",
      "amount": 0
    },
    */
    let data = []
    let categories = []
    for (let a of this.annualBudget()) {
      let num = a.month?.split('-')[0]
      let monthName = this.months.find(m => m.number == num)?.name
      categories.push(monthName)
      data.push(a.amount)
    }

    this.annualBudgetChartOptions = {
      series: [
        {
          name: "Общая сумма",
          data: data
        }
      ],
      chart: {
        height: 350,
        type: "area",
        selection: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        }
      },
      title: {
        text: "По месяцам"
      },
      xaxis: {
        categories: categories
      }
    }
  }
}
