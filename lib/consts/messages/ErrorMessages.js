ErrorMessages = {
   EMPTY_TEXT: function () {
      toastr.error(
         "Вам нужно ввести какой нибудь текст, чтобы сохранить запись!",
         "Пустой текст."
      );
      return false;
   },
   EMPTY_IMAGE:function () {
      toastr.error(
         "Нужно выбрать картинку, чтобы сохранить запись!",
         "Картинка не выбрана."
      );
      return false;
   },
   EMPTY_PACK:function () {
      toastr.error(
         "Выберите сначала несколько файлов!",
         "Набор пустой."
      );
      return false;
   },
   EMPTY_SECTION_NAME:function () {
      toastr.error(
         "Нужно ввести имя секции, чтобы сохранить запись!",
         "Имя не задано."
      );
      return false;
   },
   EMPTY_VIDEO:function () {
      toastr.error(
         "Нужно выбрать видео, чтобы сохранить запись!",
         "Видео не выбрано."
      );
      return false;
   },
   FILE_NOT_SAVED:function () {
      toastr.error(
         "Не удалось сохранить файл в системе.",
         "Ошибка."
      );
      return false;
   },
   NO_FILE_TO_REMOVE:function () {
      toastr.error(
         "Файл для удаления отсутствует.",
         "Ошибка."
      );
      return false;
   },
   SAVE_FAILED: function (whatWasSaving) {
      toastr.error(
         "Ошибка сохранения " + whatWasSaving + " на сервере! Попробуйте еще раз",
         "Запись не сохранена."
      );
      return false;
   },
   DELETE_FAILED:function (whatWasDeleting) {
      toastr.error(
         "Ошибка удаления "+whatWasDeleting+" на сервере! Попробуйте еще раз",
         "Запись не сохранена."
      );
      return false;
   },
   FILE_DELETE_ERROR:function () {
      toastr.clear();
      toastr.error(
         "Файл не удален, возможно он не существует.",
         "Ошибка удаления."
      );
      return false;
   },
   CONTENT_TEXT_IMAGE_SAVE_FAILED:function () {
      toastr.error(
         "Сохранение картинки к тексту не удалось, попробуйте еще раз",
         "Ошибка сохранения."
      );
      return false;
   },
   SECTION_TEXT_IMAGE_SAVE_FAILED:function () {
      toastr.error(
         "Создание иконки к секции не удалось, попробуйте создать секцию еще раз",
         "Ошибка сохранения."
      );
      return false;
   },
   NO_TEMPLATE: function () {
      toastr.error(
         "Проверьте правильность имени шаблона!",
         "Нету шаблона."
      );
      return false;
   },
   IMAGE_HEIGHT_LIMIT: function (value) {
      toastr.error(
         "Размер картинки в высоту больше максимального размера " + value,
         "Картинка не может быть загружена."
      );
      return false;
   },
   IMAGE_WIDTH_LIMIT: function (value) {
      toastr.error(
         "Размер картинки в ширину больше максимального размера " + value,
         "Картинка не может быть загружена."
      );
      return false;
   }
}
