import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    PaginationComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  animations: [slideLeftMargin]
})
export class ClientsComponent {

  clients: WritableSignal<any[]> = signal([])
  show_filter: WritableSignal<boolean> = signal(true)
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  })

  getClients() {
    this.clients.set(
      [
        {
          "id": 1,
          "createdDate": "2023-11-23T10:25:43.511Z",
          "fio": "Иванов Иван Иванович",
          "phone": "+79251234567",
          "usluga": "Профессиональная чистка"
        },
        {
          "id": 2,
          "createdDate": "2023-12-05T14:12:09.876Z",
          "fio": "Петрова Мария Петровна",
          "phone": "+79165432109",
          "usluga": "Лечение кариеса"
        },
        {
          "id": 3,
          "createdDate": "2023-11-28T16:34:21.123Z",
          "fio": "Сидоров Алексей Сергеевич",
          "phone": "+79857654321",
          "usluga": "Установка коронки"
        },
        {
          "id": 4,
          "createdDate": "2023-12-01T09:55:00.456Z",
          "fio": "Козлова Ольга Владимировна",
          "phone": "+79031234567",
          "usluga": "Отбеливание зубов"
        },
        {
          "id": 5,
          "createdDate": "2023-11-30T13:22:33.789Z",
          "fio": "Михайлов Дмитрий Андреевич",
          "phone": "+79215432109",
          "usluga": "Имплантация"
        },
        {
          "id": 6,
          "createdDate": "2023-12-02T11:44:55.123Z",
          "fio": "Носова Екатерина Сергеевна",
          "phone": "+79877654321",
          "usluga": "Ортодонтия"
        },
        {
          "id": 7,
          "createdDate": "2023-12-04T15:11:22.456Z",
          "fio": "Романов Александр Петрович",
          "phone": "+79051234567",
          "usluga": "Профилактический осмотр"
        },
        {
          "id": 8,
          "createdDate": "2023-11-29T17:33:44.789Z",
          "fio": "Смирнова Татьяна Николаевна",
          "phone": "+79225432109",
          "usluga": "Лечение десен"
        },
        {
          "id": 9,
          "createdDate": "2023-12-03T12:55:11.123Z",
          "fio": "Волков Сергей Иванович",
          "phone": "+79887654321",
          "usluga": "Удаление зуба"
        },
        {
          "id": 10,
          "createdDate": "2023-12-06T10:22:33.456Z",
          "fio": "Иванова Анна Петровна",
          "phone": "+79061234567",
          "usluga": "Протезирование"
        }
      ]
    )
    this.total_pages = 50
    this.totalElements = this.clients().length
  }

  clearFilter(){
  }


  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getClients()
  }
}
