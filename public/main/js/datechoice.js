$(document).ready(function () {
              $('input[name="daterange"]').daterangepicker({
                opens: 'left',
                minYear: 1901,
                maxYear: parseInt(moment().format('YYYY'),10),
                "showDropdowns": true,
          "locale": {
              "format": "DD.MM.YYYY",
              "separator": " - ",
              "applyLabel": "Установить",
              "cancelLabel": "Отмена",
              "fromLabel": "От",
              "toLabel": "До",
              "customRangeLabel": "Custom",
              "weekLabel": "W",
              "daysOfWeek": [
                "Вск",
                "Пнд",
                "Вто",
                "Сре",
                "Чет",
                "Пят",
                "Суб"
              ],
            "monthNames": [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь"
          ],
                "firstDay": 1
        },
    "linkedCalendars": false,
    "autoUpdateInput": false,
    "showCustomRangeLabel": false,
    "startDate": "10/03/2021",
    "endDate": "10/03/2021",
    "minDate": "DD.MM.YYYY",
    "maxDate": "DD.MM.YYYY",
    "opens": "left"
}, function(start, end, label) {
                  console.log("A new date selection was made: " + start.format('DD.MM.YYYY') + ' to ' + end.format('DD.MM.YYYY'));
              });

 });
