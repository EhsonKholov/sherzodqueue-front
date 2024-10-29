import {Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {DropdownDirective} from '../../directives/dropdown.directive';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [DropdownDirective, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {

  options_toggle: WritableSignal<boolean> = signal(false)
  @Input() options: WritableSignal<any[]> = signal([])
  @Input() objParamView: string = ''
  @Input() label: string = ''
  @Input() selectedOption: any = {}
  @Input() filterParam: string = ''
  @Output() selectedOptionEmmit = new EventEmitter<any>()
  @Output() selectFilterParam = new EventEmitter<any>()


  selectOption(o: any) {
    this.selectedOption = o
    this.filterParam = o[this.objParamView]
    this.options_toggle.set(false)
    this.selectedOptionEmmit.emit(this.selectedOption)
  }

  closeOptions() {
    this.options_toggle.set(false)
  }

  clear() {
    this.selectedOption = {}
    this.filterParam = ''
    this.selectedOptionEmmit.emit(this.selectedOption)
    this.selectFilterParam.emit(this.filterParam)
  }

  filter() {
    this.selectFilterParam.emit(this.filterParam)
  }
}
