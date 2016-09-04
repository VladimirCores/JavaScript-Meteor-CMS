(function(Comman){
    // handle the command
   Comman.handle(UtilsCommands.SET_NEW_CONTENT_POSITION, function(contentVO, sectionVO) {
      if(sectionVO) {
         contentVO.position = sectionVO.contains + 1;
      } else {
         contentVO.position = Content.find({sid:contentVO.sid}).count() + 1;
      }
      this.resolve();
   });
})(Comman);
