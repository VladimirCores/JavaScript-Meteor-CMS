// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.EDIT_PACK, function(packVO) {
      console.log("> ContentCommands.EDIT_PACK", packVO);

      let EXECUTE = Comman.execute;
      let packDataVO = packVO.data;
      let sectionID = packVO.sid._str;

      let savePackAsSeparateImages = true;
      let that = this;

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "packModal",
         packVO,
         function(
            modalOutputPackDataVO,
            saveAsSeparateImages
         ) {
            if(modalOutputPackDataVO.files.length === 0) {
               return false;
            }
            if(modalOutputPackDataVO.title.length === 0) {
               modalOutputPackDataVO.title = "Набор картинок";
            } else {
               packDataVO.title = modalOutputPackDataVO.title;
            }
            savePackAsSeparateImages = saveAsSeparateImages;
            console.log(modalOutputPackDataVO);
            this.resolve(modalOutputPackDataVO);
      })
      .then(function (newPackDataVO) {
         let promises = [];
         let files = packDataVO.files;
         console.log(sectionID, newPackDataVO.files);

         _.forEach(newPackDataVO.files, function (imageDataVO) {
            let imageVO = new ImageVO(sectionID);
            promises.push(
               EXECUTE(ContentCommands.INSERT_IMAGE_FILE, imageDataVO.file)
               .then(
                  function (imageFile) {
                     imageDataVO.file = imageFile;
                     imageVO.data = imageDataVO;
                     imageVO.position = files.length;
                     files.push(imageVO);
                  },
                  function (error) { ErrorMessages.FILE_NOT_SAVED(); }
               )
            );
         });

         console.log(promises);

         Q.all(promises).then(function () {
            if(savePackAsSeparateImages) {
               let section = Sections.findOne(packVO.sid);
               let position = section.contains;
               let addContentPromises = []
               while(files.length) {
                  let imageVO = files.shift();
                  imageVO.position = ++position;
                  addContentPromises.push(
                     EXECUTE(
                        ContentCommands.ADD_CONTENT,
                        imageVO,
                        section
                     )
                  )
               }
               Q.all(addContentPromises).then(function () {
                  EXECUTE(ContentCommands.REMOVE_CONTENT, packVO, true)
                  .then(function () {
                     that.resolve();
                  });
               })
            } else {
               packDataVO.files = files;
               packVO.data = packDataVO;
               Meteor.call(MeteorMethods.EDIT_CONTENT, packVO, function () {
                  console.log("Edit Pack Finished");
                  that.resolve();
               });
            }
         });
      })
      // END - EXECUTE - ModalCommands.SHOW_MODAL
   }
);
})(Comman);
