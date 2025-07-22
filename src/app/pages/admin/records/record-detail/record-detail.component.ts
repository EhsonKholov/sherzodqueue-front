import {Component, input, output, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {SecondsToDatePipe} from '../../../../pipes/seconds-to-date.pipe';
import {ToothDentalFormulaComponent} from '../../../../components/tooth-dental-formula/tooth-dental-formula.component';

@Component({
  selector: 'app-record-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DialogModule,
    SecondsToDatePipe,
    ToothDentalFormulaComponent
  ],
  templateUrl: './record-detail.component.html',
  styleUrl: './record-detail.component.css'
})
export class RecordDetailComponent {

  record = input.required<any>()
  close = output<any>()

  print = input<boolean>(false)

  recordDetailModalShow = signal(true)


  getSelectedToothFromRecordAsSignal(record: any) {
    let selectedTooth: WritableSignal<any[]> = signal([])
    if (record?.details != null && record?.details.length > 0) {
      for (let detail of this.record()?.details) {
        selectedTooth().push(detail?.toothId)
      }
    }

    return selectedTooth;
  }

  closeModal() {
    this.close.emit(null)
  }
}
