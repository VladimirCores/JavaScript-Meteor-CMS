(function(Comman){
   // handle the command
   Comman.handle(SettingsCommands.UPDATE_USER_IMAGE_SETTINGS,
   function(textImageDataVO) {
      console.log("> SettingsCommands.UPDATE_USER_TEXT_IMAGE", textImageDataVO);
      let currentUserProfile = Meteor.user().profile;
      if(currentUserProfile.settings == null) currentUserProfile.settings = {};

      if(textImageDataVO != null) {
         let textImageSettingsVO = new TextImageSettingsVO();
         _.forEach(textImageSettingsVO, function (val, key) {
            textImageSettingsVO[key] = textImageDataVO[key];
         });
         console.log("> SettingsCommands.UPDATE_USER_TEXT_IMAGE settigns", textImageSettingsVO);
         currentUserProfile.settings.image = textImageSettingsVO;
      } else {
         currentUserProfile.settings.image = null;
      }
      Meteor.call(MeteorMethods.STORE_USER_SETTING, currentUserProfile.settings)
   });
})(Comman);
