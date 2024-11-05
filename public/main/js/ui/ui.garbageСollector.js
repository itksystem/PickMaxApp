/* Сборщик мусора - удаляет все обьекты которые создаются после тэга addon*/
$(document).ready(function () {
  $(".garbage-clear").off("click").on("click",function(e){
   console.log('.garbage-clear !!!');
      $(".xdsoft_datetimepicker").remove(); // сборщик мусора
      $(".pac-container").remove(); // сборщик мусора
  });
});