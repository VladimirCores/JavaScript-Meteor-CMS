(function(Comman){
    // handle the command
   Comman.handle(SectionCommands.RENAME_SECTION, function(value, section) {
      console.log("> SectionCommands.RENAME_SECTION", value);
      if(section) {
         section.name = value;
         let app = ViewModel.findOne('app');
         app.load({name:value});
         Meteor.call(MeteorMethods.RENAME_SECTION, section);
      }
   });
})(Comman);
