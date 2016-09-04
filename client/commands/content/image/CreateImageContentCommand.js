// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.CREATE_IMAGE, function(section) {
      console.log("> ContentCommands.CREATE_IMAGE", section);

      let that = this;
      let EXECUTE = Comman.execute;
      let imageVO = new ImageVO(GID(section));

      EXECUTE(UtilsCommands.SET_NEW_CONTENT_POSITION, imageVO, section)
      .then(function () {

         EXECUTE(
            ModalCommands.SHOW_MODAL,
            "imageAdvancedModal",
            imageVO,
            function(modalOutputImageDataVO) {
               if(!modalOutputImageDataVO.file) {
                  return ErrorMessages.EMPTY_IMAGE();
               }
               if(modalOutputImageDataVO.title.length == 0) {
                  modalOutputImageDataVO.title = "Блок изображения";
               }
               this.resolve(modalOutputImageDataVO);
         })
         .then(function (newImageDataVO) {
            return EXECUTE(
               ContentCommands.INSERT_IMAGE_FILE,
               newImageDataVO.file,
               true
            )
            .then(
               function (imageFile) {
                  newImageDataVO.file = imageFile;
                  imageVO.data = newImageDataVO;
                  return EXECUTE(
                     ContentCommands.ADD_CONTENT,
                     imageVO,
                     section
                  ).then(function () {
                     that.resolve();
                  });
               },
               function (error) {
                  ErrorMessages.FILE_NOT_SAVED();
               }
            );
         })
      });
   }
);
})(Comman);
