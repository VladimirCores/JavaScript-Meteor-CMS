SuccessMessages = {
   SAVE_COMPLETE:function (whatIsSaved) {
      toastr.clear();
      toastr.success(
         "Операция сохранения "+ whatIsSaved +" завершена!",
         "Запись успешна сохранена."
      );
      return true;
   },
   DELETE_OLD_COMPLETE:function () {
      toastr.clear();
      toastr.success(
         "Предыдущий файл удален на сервере.",
         "Удаление успешно!"
      );
      return true;
   }
}
