(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.EDIT_TEXT, function(textVO) {
      console.log("> ContentCommands.EDIT_TEXT", textVO);

      let EXECUTE = Comman.execute;
      let oldTextDataVO = textVO.data;
      let isUserAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);

      // Если пользователь не админ то параметры рендеринга текста
      // берутся из настроек профайла, но только в том случае
      // если они не были назначены при создании картинки
      if(!isUserAdmin && oldTextDataVO.image == null) {
         oldTextDataVO.image = Meteor.user().profile.settings.image;
      }

      EXECUTE(
         ModalCommands.SHOW_MODAL,
         "textModal",
         textVO,
         function (newTextDataVO, saveTextSettingAsStandart) {
            if(newTextDataVO.text.length == 0) {
               return ErrorMessages.EMPTY_TEXT();
            }
            if(newTextDataVO.title.length == 0) {
               inputTextData.title = "Текстовый блок";
            }

            isUserAdmin = isUserAdmin && saveTextSettingAsStandart;

            this.resolve(newTextDataVO);
            return true;
      })
      .then(function (newTextDataVO) {
         let oldimage = oldTextDataVO.image;
         return EXECUTE(
            UtilsCommands.RE_RENDER_TEXT_AND_INSERT_IMAGE,
            oldimage ? oldimage.file : null,
            newTextDataVO.html,
            newTextDataVO,
            true
         );
      }).then(function (newTextDataVO) {
         textVO.data = newTextDataVO;
         Meteor.call(MeteorMethods.EDIT_CONTENT, textVO);
         // Сохраняем настройки рендера текста в профиль пользователя
         // Собираются все параметры кроме файла
         if(isUserAdmin) {
            EXECUTE(SettingsCommands.UPDATE_USER_TEXT_IMAGE, textDataVO.image);
         }
      });
   }
);
})(Comman);
