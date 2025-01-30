import {Component, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarComponent} from '../../../components/calendar/calendar.component';
import {fadeAnimation} from '../../../animations/fade.animation';
import {RecordsTableComponent} from './records-table/records-table.component';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    CalendarComponent,
    RecordsTableComponent,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
  animations: [slideLeftMargin, fadeAnimation],
})
export class RecordsComponent implements OnInit {

  protected readonly TabActiveEnum = TabActiveEnum;

  addRecord = signal<boolean>(false);

  tabActive = signal(TabActiveEnum.Table)

  ngOnInit(): void {
    let recTabActive = localStorage.getItem('recTabActive')
    if (recTabActive != null && recTabActive.trim() != '' && !isNaN(Number.parseInt(recTabActive))) {
      this.changeTab(Number.parseInt(recTabActive))
    } else {
      this.changeTab(this.tabActive())
    }
  }

  changeTab(tab: TabActiveEnum) {
    this.tabActive.set(tab)
    localStorage.setItem('recTabActive', this.tabActive().toString())
  }
}

export enum TabActiveEnum {
  Table = 0,
  Calendar = 1,
}
