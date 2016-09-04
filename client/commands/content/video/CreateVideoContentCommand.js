// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.CREATE_VIDEO, function(section) {
      console.log("> ContentCommands.CREATE_VIDEO", section);

      let that       = this;
      let EXECUTE    = Comman.execute;
      let videoVO    = new VideoVO(GID(section));

      EXECUTE(UtilsCommands.SET_NEW_CONTENT_POSITION, videoVO, section)
      .then(function () {
         EXECUTE(
            ModalCommands.SHOW_MODAL,
            "videoModal",
            videoVO,
            function(modalOutputVideoDataVO) {
               // На всякий случай проверяем выбран ли файл
               if(!modalOutputVideoDataVO.file) {
                  return ErrorMessages.EMPTY_VIDEO();
               }
               if(modalOutputVideoDataVO.title.length == 0) {
                  modalOutputVideoDataVO.title = "Видео блок";
               }
               this.resolve(modalOutputVideoDataVO);
               return true;
         })
         .then(function (newVideoDataVO) {
            return EXECUTE(
               ContentCommands.INSERT_VIDEO_FILE,
               newVideoDataVO.file,
               true
            )
            .then(function (videoFile) {
               newVideoDataVO.file = videoFile;
            }, function (error) {
               ErrorMessages.FILE_NOT_SAVED();
               newVideoDataVO.file = null;
            })
            .then(function () {
               return newVideoDataVO;
            })
         })
         .then(function (newVideoDataVO) {
            if(newVideoDataVO.thumb) {
               return EXECUTE(
                  ContentCommands.INSERT_IMAGE_FILE,
                  newVideoDataVO.thumb,
                  true
               )
               .then(function (imageFile) {
                  newVideoDataVO.thumb = imageFile;
               }, function (error) {
                  ErrorMessages.FILE_NOT_SAVED();
                  newVideoDataVO.thumb = null;
               })
               .then(function () {
                  return newVideoDataVO;
               })
            } else {
               return newVideoDataVO;
            }
         })
         .then(function (newVideoDataVO) {
            videoVO.data = newVideoDataVO;
            EXECUTE(ContentCommands.ADD_CONTENT, videoVO, section)
            .then(function () {
               that.resolve();
            })
         });
      })
});
})(Comman);
