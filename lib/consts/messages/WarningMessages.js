WarningMessages = {
   LOADING_IN_PROGRESS_MANUAL: function (whatIsLoading) {
      toastr.clear();
      return toastr.warning(
         "Идет процесс загрузки " + whatIsLoading,
         "Подождите пожалуйста!"
         // ,
         // {
         //    closeButton:false,
         //    progressBar:false,
         //    onclick:function () {}
         // }
      );
   },
   DELETING_FILE_FROM_SERVER:function () {
      toastr.clear();
      toastr.warning(
         "Удаляем предыдущий файл с сервера.",
         "Подождите пожалуйста!"
      );
   },
   SORT_IMPOSSIBLE_ONLY_ONE_ITEM:function () {
      toastr.clear();
      toastr.warning(
         "Всего один пункт.",
         "Сортировка невозможна!"
      );
   },
   SORT_IMPOSSIBLE_NO_ITEMS:function () {
      toastr.clear();
      toastr.warning(
         "Нечего сортировать.",
         "Сортировка невозможна!"
      );
   }
}
