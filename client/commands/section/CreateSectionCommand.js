(function(Comman){
    // handle the command
   Comman.handle(SectionCommands.CREATE_SECTION, function(currentActiveSection) {

      let that = this;
      let EXECUTE = Comman.execute;
      let newSectionVO = new SectionVO();

      // Если это самая первая секция, то текущая секция будет null
      // Тогда мы сразу отключаем checkbox для создания сабсекции.
      // Этот checkbox для сабсекции будет показан только
      // при условии sectionVO.subof == null (см. sectionModal.js (строка 38))
      if(currentActiveSection == null) {
         newSectionVO.subof = false;
      }

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "sectionModal",
         newSectionVO,
         function (modalOutputSectionDataVO, sectionTitle) {
            // Проверка на длину имени
            if(modalOutputSectionDataVO.name.length == 0) {
               return ErrorMessages.EMPTY_SECTION_NAME();
            }
            if(sectionTitle.length == 0) {
               sectionTitle = GID(newSectionVO);
            }
            newSectionVO.title = sectionTitle;
            this.resolve(modalOutputSectionDataVO);
            return true;
         }
      )
      .then(function (newSectionDataVO) {
         if(newSectionDataVO.image) { // Этот параментр выходит из modal
            return EXECUTE(
               ContentCommands.RENDER_HTML,
               newSectionDataVO.image,
               newSectionDataVO.name,
               true
            ).then(function (imageFile) {
               newSectionDataVO.image.file = imageFile;
            }, function (error) {
               ErrorMessages.SECTION_TEXT_IMAGE_SAVE_FAILED();
               newSectionDataVO.image.file = null;
            }).then(function () {
               return newSectionDataVO;
            });
         } else {
            return newSectionDataVO;
         }
      })
      .then(function (newSectionDataVO) {
         // Преряем иконку и сохраняем ее
         if(newSectionDataVO.icon) {
            return EXECUTE(
               ContentCommands.INSERT_IMAGE_FILE,
               newSectionDataVO.icon.file
            ).then(function (imageFile) {
               newSectionDataVO.icon.file = imageFile;
            }, function (error) {
               newSectionDataVO.icon.file = null;
            }).then(function () {
               return newSectionDataVO
            });
         } else {
            return newSectionDataVO;
         }
      })
      .then(function (newSectionDataVO) {
         newSectionVO.data = newSectionDataVO;
         let isInSubSection = newSectionVO.subof !== false;
         if(isInSubSection) {
            newSectionVO.subof = currentActiveSection ? currentActiveSection._id : false;
         } else {
            newSectionVO.subof = currentActiveSection ? currentActiveSection.subof : false;
         }
         newSectionVO.root = currentActiveSection ? (currentActiveSection.root ? currentActiveSection.root : currentActiveSection._id) : false;
         Meteor.call(MeteorMethods.ADD_SECTION, newSectionVO, function (result) {
            EXECUTE(MenuCommands.SELECT_SECTION, newSectionVO._id, !isInSubSection);
            that.resolve();
         });
      })
      // END - EXECUTE - ModalCommands.SHOW_MODAL
   });
})(Comman);
