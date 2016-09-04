(function(Comman){
    // handle the command
   Comman.handle(MenuCommands.SET_NAVIGATION, function(id, back) {
      console.log("> MenuCommands.SET_NAVIGATION", back, id);

      let currentUserProfile = Meteor.user().profile;
      let navigation = currentUserProfile.navigation;

      if(id)
      {
         activeSection = Sections.findOne(id);
         if(activeSection)
         {
            if(navigation && Array.isArray(navigation) && navigation.length > 0)
            {
               if(back)
               {
                  let sectionNavVO;
                  let isIndexFounded = false;
                  let counter = navigation.length;
                  while(counter--)
                  {
                     sectionNavVO = navigation[counter];
                     if(sectionNavVO.id && sectionNavVO.id.equals(id)) {
                        navigation = navigation.slice(0, sectionNavVO.index);
                        sectionNavVO.name = activeSection.data.name;
                        isIndexFounded = true;
                        break;
                     }
                  }
                  if(!isIndexFounded)
                  {
                     // Если мы не находим _id в списке навигации, то это значит
                     // что мы добавили новую секцию на уровень выше
                     // Поэтому переходим на уровень выше
                     navigation = navigation.slice(0, -1);
                     navigation.push(new SectionNavVO(navigation.length + 1, id, activeSection.data.name));
                  }
               }
               else
               {
                  navigation.push(new SectionNavVO(navigation.length + 1, id, activeSection.data.name));
               }
            }
            else
            {
               navigation = [new SectionNavVO(1, id, activeSection.data.name)];
            }
         }
      }
      else
      {
         navigation = [];
      }

      Meteor.call(MeteorMethods.STORE_USER_NAV, navigation);

      this.resolve();
});
})(Comman);
