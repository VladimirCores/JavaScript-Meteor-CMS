(function(Comman){
    // handle the command
   Comman.handle(MenuCommands.SELECT_SECTION, function(id, back) {
      console.log("> MenuCommands.SELECT_SECTION", back, id);

      let menu = ViewModel.findOne('menu');
      let activeSection = null;
      let activeSectionID = null;
      let activeSectionName = "";

      if(menu == null) {
         this.resolve();
         return;
      }

      activeSection = menu.section();

      // Deselect previous
      if(activeSection) {
         activeSection.active = false;
         Meteor.call(MeteorMethods.DESELECT_SECTION, activeSection._id);
         activeSection = null;
      }

      if(id) {
         activeSection = Sections.findOne(id);
         if(activeSection) {
            activeSectionName = activeSection.data.name;
            activeSectionID = GID(activeSection);
         }
      }

      $(".popup").remove();

      console.log("activeSection:", activeSection);

      menu.section(activeSection);
      Meteor.call(MeteorMethods.SELECT_SECTION, id);

      Session.set(SessionVariables.SELECTED_SESSION_ID, activeSectionID);
      Session.set(SessionVariables.SELECTED_SECTION_NAME, activeSectionName);

      Comman.execute(MenuCommands.SET_NAVIGATION, id, back);

      this.resolve();
});
})(Comman);
