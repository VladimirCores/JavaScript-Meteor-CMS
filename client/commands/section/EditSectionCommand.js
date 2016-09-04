(function(Comman){
    // handle the command
   Comman.handle(SectionCommands.EDIT_SECTION, function(sectionVO) {
      // console.log("> SectionCommands.EDIT_SECTION", sectionVO);

      let EXECUTE = Comman.execute;
      let oldSectionDataVO = sectionVO.data;
      let that = this;

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "sectionModal",
         sectionVO,
         function (modalOutputSectionDataVO, sectionTitle) {
            // Проверка на длину имени
            if(modalOutputSectionDataVO.name.length == 0) {
               return ErrorMessages.EMPTY_SECTION_NAME();
            }
            sectionVO.title = sectionTitle;
            this.resolve(modalOutputSectionDataVO);
            return true;
         }
      )
      .then(function (newSectionDataVO) {
		let oldimage = oldSectionDataVO.image;
		// Эта команда после выполнения передает дальше объект newSectionDataVO
		return EXECUTE(
		   UtilsCommands.RE_RENDER_TEXT_AND_INSERT_IMAGE,
		   oldimage ? oldimage.file : null,
		   newSectionDataVO.name,
		   newSectionDataVO
		);
      })
      .then(function (newSectionDataVO) {
         // console.log("> SectionCommands.EDIT_SECTION: icon", newSectionDataVO.icon, oldSectionDataVO.icon);
         let oldSectionIconFile = oldSectionDataVO.icon ? oldSectionDataVO.icon.file : null;

         // Если иконка не удалена
         if(newSectionDataVO.icon) {
            // Если иконка изменилась
            if(oldSectionIconFile == null || newSectionDataVO.icon.file !== oldSectionIconFile) {
               let holder = newSectionDataVO.icon;
               return EXECUTE(
                  ContentCommands.REPLACE_MEDIA_FILE,
                  ContentCommands.INSERT_IMAGE_FILE,
                  oldSectionIconFile,
                  holder.file,
                  holder,
                  "file"
               ).then(function (icon) {
                  newSectionDataVO.icon = icon
                  return newSectionDataVO;
               });
            } else {
               return newSectionDataVO;
            }
         } else {
            // Удаляем иконку
            return EXECUTE(
               ContentCommands.DELETE_FILE,
               oldSectionIconFile
            ).then(function () {
               return newSectionDataVO;
            })
         }
      })
      .then(function (newSectionDataVO) {
         sectionVO.data = newSectionDataVO;
         // console.log("> SectionCommands.EDIT_SECTION: newSectionDataVO", sectionVO);
         Meteor.call(MeteorMethods.EDIT_SECTION, sectionVO, function (error) {
            if(!error)
            EXECUTE(MenuCommands.SELECT_SECTION, sectionVO._id, true);
            // console.log("> SectionCommands.EDIT_SECTION: complete", error);
            that.resolve();
         });
      })
      // END - EXECUTE - ModalCommands.SHOW_MODAL
   });
})(Comman);
