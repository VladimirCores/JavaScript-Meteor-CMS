(function(Comman){
    // handle the command
      Comman.handle(ContentCommands.ADD_CONTENT, function(content, section) {
         let that = this;
         Meteor.call(MeteorMethods.ADD_CONTENT, content, function (result) {
            // console.log("ContentCommands.ADD_CONTENT result");
            if(section) section.contains += 1;
            that.resolve();
         });
      }
   );
})(Comman);
