// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.EDIT_IMAGE, function(imageVO) {
      console.log("> ContentCommands.EDIT_IMAGE", imageVO);

      let EXECUTE = Comman.execute;
      let oldImageDataVO = imageVO.data;

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "imageAdvancedModal",
         imageVO,
         function(modalOutputImageDataVO) {
            console.log("> ContentCommands.EDIT_IMAGE modalOutputImageDataVO", modalOutputImageDataVO);
            if(!modalOutputImageDataVO.file) {
               return ErrorMessages.EMPTY_IMAGE();
            }
            if(modalOutputImageDataVO.title.length == 0) {
               modalOutputImageDataVO.title = "Блок изображения";
            }
            this.resolve(modalOutputImageDataVO);
            return true;
      })
      .then(function (newImageDataVO) {
         if(newImageDataVO.file != oldImageDataVO.file) {
            // Удаляем старый файл и ставим новый только если он изменился
            return EXECUTE(
               ContentCommands.REPLACE_MEDIA_FILE,
               ContentCommands.INSERT_IMAGE_FILE,
               oldImageDataVO.file,
               newImageDataVO.file,
               newImageDataVO,
               "file"
            );
         } else {
            // Если файл не изменился проверяем на изменения описания или заголовка
            if(   newImageDataVO.text != oldImageDataVO.text
               || newImageDataVO.title != oldImageDataVO.title)
            return newImageDataVO;
            else {
               return null;
            }
         }
      }).then(function (newImageDataVO) {
         if(newImageDataVO) {
            imageVO.data = newImageDataVO;
            Meteor.call(MeteorMethods.EDIT_CONTENT, imageVO);
         }
      });
   }
);
})(Comman);
