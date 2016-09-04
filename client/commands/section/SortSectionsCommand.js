(function(Comman){
    // handle the command
   Comman.handle(SectionCommands.SORT_SECTIONS, function(activeSection) {
      console.log("> SectionCommands.SORT_SECTIONS");

      let subof = activeSection ? activeSection._id : false;
      let that = this;

      let sectionsArray = Sections.find(
         {subof:subof},
         {sort:{position:1}}
      ).fetch();

      if(sectionsArray.length === 0) {
         that.resolve();
         WarningMessages.SORT_IMPOSSIBLE_NO_ITEMS();
         return;
      }

      if(sectionsArray.length > 1) {
         Comman.execute(ModalCommands.SHOW_MODAL,
         "sortSectionsModal",
         sectionsArray,
         function () {
            Meteor.call(MeteorMethods.SORT_SECTIONS, sectionsArray);
            that.resolve()
         });
      } else {
         that.resolve();
         WarningMessages.SORT_IMPOSSIBLE_ONLY_ONE_ITEM();
      }
   });
})(Comman);
