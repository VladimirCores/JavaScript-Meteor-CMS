(function(Comman){
    // handle the command
   Comman.handle(UtilsCommands.RE_RENDER_TEXT_AND_INSERT_IMAGE, function(oldFile, newText, holder, needToShowProgress) {
      // console.log(">UtilsCommands.RE_RENDER_TEXT_AND_INSERT_IMAGE", newText, holder);

      let EXECUTE = Comman.execute;
      let that = this;

      // Если картинка изменилась
      // То сначала удаляем старую
      EXECUTE(
         ContentCommands.DELETE_FILE,
         oldFile, needToShowProgress
      ).then(function () {
         // Если стоит отметка о создании новой картинки
         // То ререндерим новую картинку из текста
         if(holder.image) {
            EXECUTE(
               ContentCommands.RENDER_HTML,
               holder.image,
               newText,
               true,
               needToShowProgress
            )
            .then(function (imageFile) {
               holder.image.file = imageFile;
            }, function (error) {
               console.log("Render HTML Error", error);
               ErrorMessages.CONTENT_TEXT_IMAGE_SAVE_FAILED();
               holder.image.file = null;
            })
            .then(function () {
               that.resolve(holder)
            });
         } else {
            // Если мы не создаем новую картинку
            that.resolve(holder);
         }
      });
   });
})(Comman);
