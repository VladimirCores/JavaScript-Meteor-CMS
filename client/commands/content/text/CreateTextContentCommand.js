(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.CREATE_TEXT, function(section) {
      console.log("> ContentCommands.CREATE_TEXT", section);

      let that       = this;
      let EXECUTE    = Comman.execute;
      let textVO     = new TextVO(GID(section));

      EXECUTE(UtilsCommands.SET_NEW_CONTENT_POSITION, textVO, section)
      .then(function () {

         let isUserAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);
         let userSettings = Meteor.user().profile.settings;

         console.log("isUserAdmin: ", isUserAdmin);
         console.log("USER SETTINGS: ", userSettings);

         // Если пользователь не админ
         // То для него мы вынимаем параметры текста
         if(!isUserAdmin || (userSettings && userSettings.image)) {
            // TextImageDataVO
            textVO.data.image = userSettings.image;
         }

         EXECUTE(
            ModalCommands.SHOW_MODAL,
            "textModal",
            textVO,
            function (modalOutputTextDataVO, saveTextSettingAsStandart) {
               if(modalOutputTextDataVO.text.length == 0) {
                  return ErrorMessages.EMPTY_TEXT();
               }
               if(modalOutputTextDataVO.title.length == 0) {
                  modalOutputTextDataVO.title = "Текстовый блок";
               }

               // Поскольку только это параметр определяет будут ли настройки сохраняться как станлартные
               isUserAdmin = isUserAdmin && saveTextSettingAsStandart;

               this.resolve(modalOutputTextDataVO);
               return true;
         })
         .then(function (newTextDataVO) {
            if(newTextDataVO.image) {
               return EXECUTE(
                  ContentCommands.RENDER_HTML,
                  newTextDataVO.image,
                  newTextDataVO.html,
                  true, /* doInsertImage */
                  true /* needToShowProgress */
               )
               .then(function (imageFile) {
                  newTextDataVO.image.file = imageFile;
               }, function (error) {
                  ErrorMessages.CONTENT_TEXT_IMAGE_SAVE_FAILED();
                  newTextDataVO.image.file = null;
               })
               .then(function () {
                  return newTextDataVO;
               });
            } else {
               return newTextDataVO;
            }
         })
         .then(function (newTextDataVO) {
            textVO.data = newTextDataVO;
            EXECUTE(ContentCommands.ADD_CONTENT, textVO, section)
            .then(function () {
               that.resolve();
               if(isUserAdmin) {
                  // console.log("> SettingsCommands.UPDATE_USER_IMAGE_SETTINGS", SettingsCommands.UPDATE_USER_IMAGE_SETTINGS);
                  EXECUTE(SettingsCommands.UPDATE_USER_IMAGE_SETTINGS,
                     newTextDataVO.image
                  );
               }
            });
         });
      });
});
})(Comman);
