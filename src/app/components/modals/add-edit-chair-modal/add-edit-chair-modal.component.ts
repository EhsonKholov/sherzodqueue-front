import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DatePipe} from '@angular/common';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {ChairsService} from '../../../services/chairs.service';

@Component({
  selector: 'app-add-edit-chair-modal',
  standalone: true,
  imports: [
    AutoCompleteModule,
    MultiSelectModule,
    NgMultiSelectDropDownModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-chair-modal.component.html',
  styleUrl: './add-edit-chair-modal.component.css'
})
export class AddEditChairModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() chair: any
  @Output() close = new EventEmitter<any>();
  @Output() getChair: EventEmitter<any> = new EventEmitter<any>()


  chairs: WritableSignal<any[]> = signal([])

  addChairFormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(null, Validators.required),
    enabled: new FormControl(true),
  })

  constructor(
    private toastService: ToastService,
    private chairsService: ChairsService,
  ) {}


  ngOnInit(): void {
    this.getChairs()

    if (!!this.chair) {
      this.addChairFormGroup.setValue({
        id: this.chair?.id,
        name: this.chair?.name,
        enabled: this.chair?.enabled,
      })
    }
  }

  ngOnDestroy(): void {
    this.completeRequests()
  }

  completeRequests() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getChairs() {
    this.completeRequests()
    let body = {}
    this.chairsService.getChairs(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.chairs.set(res?.items)
        }
      })
  }

  closeModal() {
    this.close.emit(false)
  }

  addEditChair() {
    let chair = this.addChairFormGroup.value

    if (!!this.chair) {
      this.chairsService.editChairs(this.chair?.id, chair)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.toastService.success('Запись успешно изменен')
            this.closeModal()
            this.getChair.emit()
          }, error: (err: any) => {
            this.toastService.error('Ошибка сохранения данных!')
          }
        })
    } else {
      this.chairsService.addChairs(chair)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.toastService.success('Запись успешно добавлен')
            this.closeModal()
            this.getChair.emit()
          }, error: (err: any) => {
            this.toastService.error('Ошибка сохранения данных!')
          }
        })
    }
  }
}
