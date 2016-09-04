// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.EDIT_VIDEO, function(videoVO) {
      console.log("> ContentCommands.EDIT_VIDEO", videoVO);

      let EXECUTE = Comman.execute;
      let oldVideoDataVO = videoVO.data;

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "videoModal",
         videoVO,
         function(modalOutputVideoDataVO) {
            if(!modalOutputVideoDataVO.file) {
               return ErrorMessages.EMPTY_VIDEO();
            }
            if(modalOutputVideoDataVO.title.length == 0) {
               modalOutputVideoDataVO.title = "Блок видео";
            }
            this.resolve(modalOutputVideoDataVO);
            return true;
      })
      .then(function (newVideoDataVO) {
         if(newVideoDataVO.thumb && newVideoDataVO.thumb !== oldVideoDataVO.thumb) {
            if(oldVideoDataVO.thumb) {
               return EXECUTE(
                  ContentCommands.REPLACE_MEDIA_FILE,
                  ContentCommands.INSERT_IMAGE_FILE,
                  oldVideoDataVO.thumb,
                  newVideoDataVO.thumb,
                  newVideoDataVO,
                  "thumb"
               );
            } else {
               return EXECUTE(
                  ContentCommands.INSERT_IMAGE_FILE,
                  newVideoDataVO.thumb, true
               )
               .then(function (imageFile) {
                  newVideoDataVO.thumb = imageFile;
               }, function (error) {
                  newVideoDataVO.thumb = null;
               })
               .then(function () {
                  return newVideoDataVO;
               })
            }
         } else {
            return newVideoDataVO;
         }
      })
      .then(function (newVideoDataVO) {
         // console.log("VIDEO FILES MATCHES:", newVideoDataVO.file !== oldVideoDataVO.file);
         // console.log("\n\n", newVideoDataVO.file, oldVideoDataVO.file);
         // console.log("\n\n");
         if(newVideoDataVO.file !== oldVideoDataVO.file) {
            return EXECUTE(
               ContentCommands.REPLACE_MEDIA_FILE,
               ContentCommands.INSERT_VIDEO_FILE,
               oldVideoDataVO.file,
               newVideoDataVO.file,
               newVideoDataVO,
               "file", true
            );
         } else {
            return newVideoDataVO;
         }
      })
      .then(function (newVideoDataVO) {
         videoVO.data = newVideoDataVO;
         Meteor.call(MeteorMethods.EDIT_CONTENT, videoVO);
      });
   }
);
})(Comman);
