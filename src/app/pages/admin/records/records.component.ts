import {Component, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarComponent} from '../../../components/calendar/calendar.component';
import {RecordsTableComponent} from './records-table/records-table.component';
import {RecordsListComponent} from './records-list/records-list.component';
import {fadeAnimation} from '../../../animations/fade.animation';

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
    RecordsListComponent,
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
  animations: [
    fadeAnimation
  ]
})
export class RecordsComponent implements OnInit {

  protected readonly TabActiveEnum = TabActiveEnum;

  addRecord = signal<boolean>(false);

  tabActive = signal(TabActiveEnum.List)

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

  closeAddRecord() {
    this.addRecord.set(false)
  }
}

export enum TabActiveEnum {
  List = 0,
  Table = 1,
  Calendar = 2,
}
