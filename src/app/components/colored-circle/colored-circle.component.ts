import {Component, input} from '@angular/core';

@Component({
  selector: 'app-colored-circle',
  standalone: true,
  imports: [],
  templateUrl: './colored-circle.component.html',
  styleUrl: './colored-circle.component.css'
})
export class ColoredCircleComponent {

  text = input<string>('')

  getBackgroundColor() {
    if (this.text() == null || this.text() == '')
      return ''

    return this.letterColorMap.find(c => c.letter.toUpperCase() == this.text().substring(0, 1)?.toUpperCase())?.color
  }

  letterColorMap = [
    { letter: 'A', color: '#F8F9FAFF' },
    { letter: 'B', color: 'green' },
    { letter: 'C', color: '#2357BC81' },
    { letter: 'D', color: '#af3a94' },
    { letter: 'E', color: '#d52027' },
    { letter: 'F', color: '#733b97' },
    { letter: 'G', color: '#2357BC81' },
    { letter: 'H', color: '#F8F9FAFF' },
    { letter: 'I', color: 'green' },
    { letter: 'J', color: '#2357BC81' },
    { letter: 'K', color: '#af3a94' },
    { letter: 'L', color: '#d52027' },
    { letter: 'M', color: '#733b97' },
    { letter: 'N', color: '#2357BC81' },
    { letter: 'O', color: '#F8F9FAFF' },
    { letter: 'P', color: 'green' },
    { letter: 'Q', color: '#2357BC81' },
    { letter: 'R', color: '#af3a94' },
    { letter: 'S', color: '#d52027' },
    { letter: 'T', color: '#733b97' },
    { letter: 'U', color: '#2357BC81' },
    { letter: 'V', color: '#F8F9FAFF' },
    { letter: 'W', color: 'green' },
    { letter: 'X', color: '#2357BC81' },
    { letter: 'Y', color: '#af3a94' },
    { letter: 'Z', color: '#d52027' },
    { letter: 'А', color: '#733b97' },
    { letter: 'Б', color: '#2357BC81' },
    { letter: 'В', color: '#F8F9FAFF' },
    { letter: 'Г', color: 'green' },
    { letter: 'Д', color: '#2357BC81' },
    { letter: 'Е', color: '#af3a94' },
    { letter: 'Ё', color: '#d52027' },
    { letter: 'Ж', color: '#733b97' },
    { letter: 'З', color: '#2357BC81' },
    { letter: 'И', color: '#F8F9FAFF' },
    { letter: 'Й', color: 'green' },
    { letter: 'К', color: '#2357BC81' },
    { letter: 'Л', color: '#af3a94' },
    { letter: 'М', color: '#d52027' },
    { letter: 'Н', color: '#733b97' },
    { letter: 'О', color: '#2357BC81' },
    { letter: 'П', color: '#F8F9FAFF' },
    { letter: 'Р', color: 'green' },
    { letter: 'С', color: '#2357BC81' },
    { letter: 'Т', color: '#af3a94' },
    { letter: 'У', color: '#d52027' },
    { letter: 'Ф', color: '#733b97' },
    { letter: 'Х', color: '#2357BC81' },
    { letter: 'Ц', color: '#F8F9FAFF' },
    { letter: 'Ч', color: 'green' },
    { letter: 'Ш', color: '#2357BC81' },
    { letter: 'Щ', color: '#af3a94' },
    { letter: 'Ъ', color: '#d52027' },
    { letter: 'Ы', color: '#733b97' },
    { letter: 'Ь', color: '#2357BC81' },
    { letter: 'Э', color: '#F8F9FAFF' },
    { letter: 'Ю', color: 'green' },
    { letter: 'Я', color: '#2357BC81' }
  ];
}
