import {Component, OnInit} from '@angular/core';
import $ from 'jquery';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-tooth-dental-formula',
  standalone: true,
  imports: [
    TooltipModule
  ],
  templateUrl: './tooth-dental-formula.component.html',
  styleUrl: './tooth-dental-formula.component.css'
})
export class ToothDentalFormulaComponent implements OnInit {


  ngOnInit(): void {
    /*var doc = $(document);
    doc
      .on('click touchstart', '.tooth', function (event) {
        var $this = $(this),
          toothText = $this.data('title'),
          $numberText = $('.tooth-number'),
          number;
        if (/(^|\s)active(\s|$)/.test(<string>$this.attr("class"))) {
          $this.attr('class', 'tooth');
          $numberText.html('&times;').data('title', 'Закрыть');
          number = false;
        } else {
          $this.attr('class', 'tooth active').siblings().attr('class', 'tooth');
          $numberText.html('<b>' + toothText + '</b>, далее').data('title', 'Следующий шаг');
          number = toothText;
        }
        $.event?.trigger({
          type: "change.tooth",
          message: number,
          time: new Date()
        });
      })
      .on('change.tooth', function (e) {
        var $nextStep = $('[data-next-step]');
        if (e?.message) {
          $nextStep.removeClass('disabled').data('nextStep', e.message);
        } else {
          $nextStep.addClass('disabled').data('nextStep', '');
        }
        console.log($nextStep.data('nextStep'));
      });
    jQuery(document).ready(function ($) {
      $('[data-title]').tooltip({
        title: function () {
          return $(this).data('title');
        },
        container: 'body'
      });
    });*/
  }

}
