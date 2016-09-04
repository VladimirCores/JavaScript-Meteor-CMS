// a module to represent a methods, which responds to a command
(function(Comman){
    // handle the command
      Comman.handle(ContentCommands.REMOVE_CONTENT, function(content, noConfirm, notSectionContent) {

         let EXECUTE = Comman.execute;
         let that = this;
         let isContentInsideSection = !notSectionContent;

         let RemoveContent = function () {
            Meteor.call(MeteorMethods.REMOVE_CONTENT, content, function (error, success) {
               console.log("> ContentCommands.REMOVE_CONTENT RemoveContent success:", success);
               // TODO: Check success
               if(isContentInsideSection) {
                  let activeSection = ViewModel.findOne("menu").section();
                  if(activeSection) activeSection.contains -= 1;
               }
               that.resolve();
               that = null;
            });
         }

         let AnalyseContentBeforeRemove = function () {
            let ctype = content.type;
            let cdata = content.data;
            console.log("> ContentCommands.REMOVE_CONTENT AnalyseContentBeforeRemove:", ctype);

            if(cdata == null) return RemoveContent();

            switch (ctype) {
               case ContentTypes.VIDEO:
                  EXECUTE(ContentCommands.DELETE_FILE, cdata.thumb)
                     .then(function () {
                        return EXECUTE(ContentCommands.DELETE_FILE, cdata.file)
                     })
                     .then(RemoveContent);
               break;
               case ContentTypes.IMAGE:
                  EXECUTE(ContentCommands.DELETE_FILE, cdata.file).then(RemoveContent)
               break;
               case ContentTypes.TEXT:
                  // Если у текста есть отрендаренная картинка то удаляем ее
                  let image = cdata.image;
                  if(image) EXECUTE(ContentCommands.DELETE_FILE, image.file).then(RemoveContent)
                  else RemoveContent();
               break;
               case ContentTypes.PACK:
                  let files = cdata.files;
                  let promises = [];
                  if(files.length > 0) {
                     _.forEach(files, function (imageVO) {
                        if(imageVO)
                        promises.push(EXECUTE(ContentCommands.REMOVE_CONTENT, imageVO, true, true));
                     })
                  }
                  Q.all(promises).then(RemoveContent);
               break;
               default: RemoveContent();
            }
         }

         if(noConfirm) AnalyseContentBeforeRemove()
         else Comman.execute(ModalCommands.SHOW_MODAL, "removeConfirmModal", content, AnalyseContentBeforeRemove)
      }
   );
})(Comman);
