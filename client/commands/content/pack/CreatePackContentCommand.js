// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.CREATE_PACK, function(section) {
      console.log("> ContentCommands.CREATE_PACK", section);

      let that       = this;
      let EXECUTE    = Comman.execute;
      let sectionID  = GID(section);
      let packVO     = new PackVO(GID(section));

      EXECUTE(UtilsCommands.SET_NEW_CONTENT_POSITION, packVO, section)
      .then(function () {

         let savePackAsSeparateImages = true;

         EXECUTE(
            ModalCommands.SHOW_MODAL,
            "packModal",
            packVO,
            function(modalOutputPackDataVO, saveAsSeparateImages) {
               if(modalOutputPackDataVO.files.length === 0) {
                  return ErrorMessages.EMPTY_PACK();
               }
               if(modalOutputPackDataVO.title.length === 0) {
                  modalOutputPackDataVO.title = "Набор " + packVO.position;
               }
               savePackAsSeparateImages = saveAsSeparateImages;
               console.log("savePackAsSeparateImages", savePackAsSeparateImages);
               this.resolve(modalOutputPackDataVO);
         })
         .then(function (newPackDataVO) {
            let promises = [];
            _.forEach(newPackDataVO.files, function (imageDataVO) {
               let imageVO = new ImageVO(sectionID);
               promises.push(
                  EXECUTE(
                     ContentCommands.INSERT_IMAGE_FILE,
                     imageDataVO.file
                  )
                  .then(
                     function (imageFile) {
                        imageDataVO.file = imageFile;
                        imageVO.data = imageDataVO;
                        if(savePackAsSeparateImages) {
                           imageVO.position = packVO.position++;
                           return EXECUTE(
                              ContentCommands.ADD_CONTENT,
                              imageVO,
                              section
                           )
                        } else {
                           imageVO.position = packVO.data.files.length;
                           packVO.data.files.push(imageVO);
                        };
                     },
                     function (error) {
                        ErrorMessages.FILE_NOT_SAVED();
                     }
               ));
            });
            Q.all(promises)
            .then(function () {
               if(!savePackAsSeparateImages) {
                  packVO.data.title = newPackDataVO.title;
                  return EXECUTE(
                     ContentCommands.ADD_CONTENT,
                     packVO, section
                  );
               }
            })
            .then(function () {
               that.resolve();
            })
         });
      });
   }
);
})(Comman);
